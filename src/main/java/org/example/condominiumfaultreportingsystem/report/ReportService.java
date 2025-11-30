package org.example.condominiumfaultreportingsystem.report;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.ReportDTO;
import org.example.condominiumfaultreportingsystem.DTO.ReportRequestDTO;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentRepository;
import org.example.condominiumfaultreportingsystem.cache.CacheService;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.company.CompanyRepository;
import org.example.condominiumfaultreportingsystem.eventHandler.events.NewPrivateReportCameEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.NewPublicReportCameEvent;
import org.example.condominiumfaultreportingsystem.exception.*;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.group.GroupRepository;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.example.condominiumfaultreportingsystem.security.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class ReportService {

    //Pagination a reportnak

    //Folytatni

    //Add a report(Private or Public) - RESIDENT
    //Send a report response - COMPANY
    //Get all public reports - both
    //Get all private reports - COMPANY
    //Get a report by id
    //Remove report

    private final ReportRepository reportRepository;
    private final GroupRepository groupRepository;
    private final ApartmentRepository apartmentRepository;

    private final UserService userService;

    private final ApplicationEventPublisher eventPublisher;
    private final CacheService cacheService;
    private final CompanyRepository companyRepository;

    @Transactional
    public ReportDTO sendPublicReport(ReportRequestDTO reportRequestDTO){

        User user  = userService.getCurrentUserTemporary();

        Optional<Apartment> apartmentOpt = apartmentRepository.findByApartmentNumberAndFloor(user.getId());

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
                .group(group)
                .user(user)
                .build();

        reportRepository.save(newReport);

        eventPublisher.publishEvent(
                new NewPublicReportCameEvent(groupDestination, user.getName(), newReport)
        );

        cacheService.evictAllReportsByStatusCache();

        return mapToDto(newReport);

    }

    public ReportDTO sendPrivateReport(Long companyId, ReportRequestDTO reportRequestDTO){

        User user  = userService.getCurrentUserTemporary();

        Optional<Apartment> apartmentOpt = apartmentRepository.findByApartmentNumberAndFloor(user.getId());

        if (apartmentOpt.isEmpty()){
            throw new UnauthorizedApartmentAccessException();
        }

        Apartment apartment = apartmentOpt.get();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(()-> new CompanyNotFoundException(companyId));

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
                .group(group)
                .user(user)
                .build();

        eventPublisher.publishEvent(
                new NewPrivateReportCameEvent(companyId, user.getName(), newReport)
        );

        return mapToDto(newReport);

    }

    @Async("asyncExecutor")
    @Cacheable(value = "reportByStatus")
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

    //Ide kell a getAllPrivateReportForCompany method

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
                .build();
    }

}
