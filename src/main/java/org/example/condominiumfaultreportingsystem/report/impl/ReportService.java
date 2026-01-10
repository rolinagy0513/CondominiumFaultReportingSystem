package org.example.condominiumfaultreportingsystem.report.impl;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.*;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentRepository;
import org.example.condominiumfaultreportingsystem.cache.CacheService;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.company.CompanyRepository;
import org.example.condominiumfaultreportingsystem.company.ServiceType;
import org.example.condominiumfaultreportingsystem.eventHandler.events.NewPrivateReportCameEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.NewPublicReportCameEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.ReportCompletedEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.ReportSubmittedEvent;
import org.example.condominiumfaultreportingsystem.exception.*;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.group.GroupRepository;
import org.example.condominiumfaultreportingsystem.report.*;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.example.condominiumfaultreportingsystem.security.user.UserService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class ReportService implements IReportService{

    private final ReportRepository reportRepository;
    private final GroupRepository groupRepository;
    private final ApartmentRepository apartmentRepository;
    private final CompanyRepository companyRepository;

    private final UserService userService;
    private final CacheService cacheService;

    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ReportDTO sendPublicReport(ReportRequestDTO reportRequestDTO){

        User user  = userService.getCurrentUserTemporary();

        Optional<Apartment> apartmentOpt = apartmentRepository.findByOwnerId(user.getId());

        if (apartmentOpt.isEmpty()){
            throw new UnauthorizedApartmentAccessException();
        }

        Apartment apartment = apartmentOpt.get();

        List<Group> userGroups = groupRepository.findByUsersId(user.getId());

        validateGroup(userGroups);

        Group group  = userGroups.getFirst();
        String groupDestination = group.getGroupName();

        Report newReport = Report.builder()
                .reportPrivacy(ReportPrivacy.PUBLIC)
                .name(reportRequestDTO.getName())
                .issueDescription(reportRequestDTO.getIssueDescription())
                .comment(reportRequestDTO.getComment())
                .roomNumber(apartment.getApartmentNumber())
                .floor(apartment.getFloor())
                .reportStatus(ReportStatus.SUBMITTED)
                .reportType(reportRequestDTO.getReportType())
                .createdAt(LocalDateTime.now())
                .companyId(null)
                .group(group)
                .user(user)
                .build();

        reportRepository.save(newReport);

        eventPublisher.publishEvent(
                new NewPublicReportCameEvent(groupDestination, user.getName(), newReport)
        );

        cacheService.evictAllPublicReportsByStatusCache();

        return mapToDto(newReport);

    }

    @Transactional
    public ReportDTO sendPrivateReport(Long companyId, ReportRequestDTO reportRequestDTO){

        User user  = userService.getCurrentUserTemporary();

        Optional<Apartment> apartmentOpt = apartmentRepository.findByOwnerId(user.getId());

        if (apartmentOpt.isEmpty()){
            throw new UnauthorizedApartmentAccessException();
        }

        Apartment apartment = apartmentOpt.get();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(()-> new CompanyNotFoundException(companyId));

        boolean isValid = validateServiceTypes(reportRequestDTO.getReportType(), company.getServiceType());

        if (!isValid){
            throw new ReportServiceTypeMismatchException(reportRequestDTO.getReportType(), company.getServiceType());
        }

        List<Group> userGroups = groupRepository.findByUsersId(user.getId());

        validateGroup(userGroups);

        Group group  = userGroups.getFirst();

        Report newReport = Report.builder()
                .reportPrivacy(ReportPrivacy.PRIVATE)
                .name(reportRequestDTO.getName())
                .issueDescription(reportRequestDTO.getIssueDescription())
                .comment(reportRequestDTO.getComment())
                .roomNumber(apartment.getApartmentNumber())
                .floor(apartment.getFloor())
                .reportStatus(ReportStatus.SUBMITTED)
                .reportType(reportRequestDTO.getReportType())
                .createdAt(LocalDateTime.now())
                .companyId(companyId)
                .group(group)
                .user(user)
                .build();

        reportRepository.save(newReport);

        eventPublisher.publishEvent(
                new NewPrivateReportCameEvent(companyId, user.getName(), newReport)
        );

        cacheService.evictAllPrivateReportsByStatusCache();

        return mapToDto(newReport);

    }

    @Transactional
    public ReportDTO acceptReport(Long reportId, Long companyId){

        User user = userService.getCurrentUserTemporary();

        Optional<Report> reportOpt = reportRepository.getReportByIdWithUser(reportId);

        if (reportOpt.isEmpty()){
            throw new ReportNotFoundException();
        }

        Report report = reportOpt.get();

        if (!report.getReportStatus().equals(ReportStatus.SUBMITTED)){
            throw new InvalidReportStatusException(report.getReportStatus());
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(()-> new CompanyNotFoundException(companyId));

        if (!user.getCompany().equals(company)){
            throw new UserNotPartOfCompanyException();
        }

        boolean isValid = validateServiceTypes(report.getReportType(), company.getServiceType());

        if (!isValid){
            throw new ReportServiceTypeMismatchException(report.getReportType(), company.getServiceType());
        }

        if (report.getReportPrivacy() == ReportPrivacy.PUBLIC){
            if (report.getCompanyId() != null) {
                throw new ReportAlreadyAcceptedException();
            }
            report.setCompanyId(companyId);
            report.setCompanyName(company.getName());
        } else {
            if (!report.getCompanyId().equals(companyId)){
                throw new RoleValidationException("This private report belongs to another company");
            }
        }

        report.setReportStatus(ReportStatus.IN_PROGRESS);
        reportRepository.save(report);

        eventPublisher.publishEvent(
                new ReportSubmittedEvent(report.getUser().getId(), company , report)
        );

        cacheService.evictAllPublicReportsByStatusCache();
        cacheService.evictAllPrivateReportsByStatusCache();

        return mapToDto(report);

    }

    @Transactional
    public CompleteReportDTO completeReport(Long reportId, Long companyId, Double cost){

        User user = userService.getCurrentUserTemporary();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(()-> new CompanyNotFoundException(companyId));

        if (!user.getCompany().equals(company)){
            throw new UserNotPartOfCompanyException();
        }

        Report report = reportRepository.findById(reportId)
                .orElseThrow(ReportNotFoundException::new);

        if (!report.getReportStatus().equals(ReportStatus.IN_PROGRESS)){
            throw new InvalidReportStatusException(ReportStatus.IN_PROGRESS);
        }

        if (!report.getCompanyId().equals(companyId)){
            throw new RoleValidationException("This report is for another company");
        }

        report.setReportStatus(ReportStatus.DONE);
        report.setCost(cost);
        reportRepository.save(report);

        cacheService.evictPrivateReportsCache(companyId);
        cacheService.evictAllPublicReportsByStatusCache();
        cacheService.evictAllPrivateReportsByStatusCache();

        eventPublisher.publishEvent(
                new ReportCompletedEvent(user.getId(), report)
        );

        return CompleteReportDTO.builder()
                .companyName(company.getName())
                .reportName(report.getName())
                .roomNumber(report.getRoomNumber())
                .cost(cost)
                .build();

    }

    @Async("asyncExecutor")
    @Cacheable(value = "privateReports", key = "#companyId")
    public CompletableFuture<List<ReportDTO>> getAcceptedReportsForCompany(Long companyId){

        Optional<List<Report>> reportsOpt = reportRepository.getAllAcceptedReportsForCompany(companyId, ReportStatus.IN_PROGRESS);

        if (reportsOpt.isEmpty()){
            throw new ReportNotFoundException();
        }

        List<Report> reports = reportsOpt.get();
        List<ReportDTO> reportDTOS = reports.stream().map(this::mapToDto).toList();

        return CompletableFuture.completedFuture(reportDTOS);
    }

    @Async("asyncExecutor")
    @Cacheable(value = "reportByPublicStatus")
    public CompletableFuture<Page<ReportDTO>> getAllPublicSubmittedReportsInGroup(Long groupId, Integer page, Integer size, String sortBy, String direction){

        Sort sort;

        if (direction.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Optional<Page<Report>> availableReportsOpt = reportRepository.getAllSubmittedPublicReportsInGroup(ReportPrivacy.PUBLIC, ReportStatus.SUBMITTED, groupId, pageable);

        if (availableReportsOpt.isEmpty()){
            throw new ReportNotFoundException();
        }

        Page<Report> availableReports = availableReportsOpt.get();

        Page<ReportDTO> reportDTOPage =  availableReports.map(this::mapToDto);

        return CompletableFuture.completedFuture(reportDTOPage);
    }

    @Async("asyncExecutor")
    @Cacheable(value = "reportByPrivateStatus")
    public CompletableFuture<Page<ReportDTO>> getAllPrivateSubmittedReportsForCompany(Long companyId, Integer page, Integer size, String sortBy, String direction){

        Company company = userService.geCurrentUsersCompany();

        if (!company.getId().equals(companyId)) {
            throw new RoleValidationException("This report is for another company");
        }

        Sort sort;

        if (direction.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Optional<Page<Report>> availableReportsOpt = reportRepository.getAllSubmittedPrivateReportsForCompany(ReportPrivacy.PRIVATE, ReportStatus.SUBMITTED, companyId, pageable);

        if (availableReportsOpt.isEmpty()){
            throw new ReportNotFoundException();
        }

        Page<Report> availableReports = availableReportsOpt.get();

        Page<ReportDTO> reportDTOPage = availableReports.map(this::mapToDto);

        return CompletableFuture.completedFuture(reportDTOPage);

    }

    public List<ReportWithCompanyDTO> getInProgressReport(){

        UserDTO currentUser = userService.getCurrentUser();

        Optional<List<Report>> reportOpt = reportRepository.findReportByUser(currentUser.getId(), ReportStatus.IN_PROGRESS);

        if (reportOpt.isEmpty()){
            throw new ReportNotFoundException();
        }

        List<Report> reports = reportOpt.get();

        return  reports.stream().map(report -> ReportWithCompanyDTO.builder()
                .senderName(report.getUser().getName())
                .reportPrivacy(report.getReportPrivacy())
                .name(report.getName())
                .issueDescription(report.getIssueDescription())
                .comment(report.getComment())
                .roomNumber(report.getRoomNumber())
                .floor(report.getFloor())
                .companyName(report.getCompanyName())
                .createdAt(report.getCreatedAt())
                .reportStatus(report.getReportStatus())
                .reportType(report.getReportType())
                .build()).toList();

    }

    public List<CompletedReportDataDTO> getCompletedReportsForUser(){

        UserDTO currentUser = userService.getCurrentUser();

        Optional<List<Report>> reportOpt = reportRepository.findReportByUser(currentUser.getId(), ReportStatus.DONE);

        if (reportOpt.isEmpty()){
            throw new ReportNotFoundException();
        }

        List<Report> reports = reportOpt.get();

        return  reports.stream().map(report -> CompletedReportDataDTO.builder()
                .residentName(report.getUser().getName())
                .companyName(report.getCompanyName())
                .reportName(report.getName())
                .roomNumber(report.getRoomNumber())
                .floorNumber(report.getFloor())
                .cost(report.getCost())
                .build()).toList();

    }

    public ReportDTO getReportById(Long reportId){

        UserDTO currentUser = userService.getCurrentUser();

        Optional<Report> reportOpt = reportRepository.getReportByIdAndUserId(reportId,currentUser.getId());

        if (reportOpt.isEmpty()){
            throw new ReportNotFoundException();
        }

        Report report = reportOpt.get();

        return mapToDto(report);

    }

    private boolean validateServiceTypes(ReportType reportType, ServiceType serviceType){

        return switch (reportType) {
            case ELECTRICITY, LIGHTNING -> serviceType == ServiceType.ELECTRICIAN;
            case WATER_SUPPLY, SEWAGE -> serviceType == ServiceType.PLUMBER;
            case HEATING -> serviceType == ServiceType.HEATING_TECHNICIANS;
            case GARBAGE_COLLECTION -> serviceType == ServiceType.CLEANING;
            case ELEVATOR -> serviceType == ServiceType.ELEVATOR_MAINTENANCE;
            case GARDENING -> serviceType == ServiceType.GARDENING;
            case SECURITY -> serviceType == ServiceType.SECURITY;
            case OTHER -> serviceType == ServiceType.OTHER;
        };

    }

    private void validateGroup(List<Group> userGroups){

        if (userGroups.isEmpty()){
            throw new GroupNotFoundException();
        }

        if (userGroups.size() > 1){
            throw new UserAssignedToMultipleGroupsException();
        }

    }

    private ReportDTO mapToDto(Report report){

        return ReportDTO.builder()
                .senderName(report.getUser().getName())
                .reportPrivacy(report.getReportPrivacy())
                .name(report.getName())
                .issueDescription(report.getIssueDescription())
                .comment(report.getComment())
                .roomNumber(report.getRoomNumber())
                .floor(report.getFloor())
                .reportStatus(report.getReportStatus())
                .reportType(report.getReportType())
                .createdAt(report.getCreatedAt())
                .build();
    }

}
