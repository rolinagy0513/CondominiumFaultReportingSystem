package org.example.condominiumfaultreportingsystem.apartment.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.DTO.*;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentRepository;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentStatus;
import org.example.condominiumfaultreportingsystem.apartment.IApartmentService;
import org.example.condominiumfaultreportingsystem.building.Building;
import org.example.condominiumfaultreportingsystem.cache.CacheService;
import org.example.condominiumfaultreportingsystem.eventHandler.events.UserJoinedEvent;
import org.example.condominiumfaultreportingsystem.exception.*;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.group.GroupRepository;
import org.example.condominiumfaultreportingsystem.group.impl.GroupService;
import org.example.condominiumfaultreportingsystem.report.Report;
import org.example.condominiumfaultreportingsystem.report.ReportRepository;
import org.example.condominiumfaultreportingsystem.report.ReportStatus;
import org.example.condominiumfaultreportingsystem.security.user.Role;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.example.condominiumfaultreportingsystem.security.user.UserRepository;
import org.example.condominiumfaultreportingsystem.security.user.UserService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApartmentService implements IApartmentService {

    private final ApartmentRepository apartmentRepository;

    private final UserService userService;
    private final GroupService groupService;
    private final CacheService cacheService;
    private final UserRepository userRepository;

    private final ApplicationEventPublisher eventPublisher;
    private final GroupRepository groupRepository;
    private final ReportRepository reportRepository;

    public ApartmentDTO getApartmentWithOwnerId(){

        UserDTO currentUser = userService.getCurrentUser();

        Optional<Apartment> apartmentOpt = apartmentRepository.findByOwnerId(currentUser.getId());

        if (apartmentOpt.isEmpty()){
            throw new ApartmentNotFoundException(currentUser.getUserName());
        }

        Apartment apartment = apartmentOpt.get();

        return mapToDto(apartment);

    }

    @Async("asyncExecutor")
    @Cacheable(value = "apartmentsByBuilding")
    public CompletableFuture<Page<ApartmentDTO>> getApartmentsInBuilding(
            Long buildingId,
            Integer page,
            Integer size,
            String sortBy,
            String direction
    ){

        Sort sort;

        if (direction.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Optional<Page<Apartment>> apartmentsPageOpt = apartmentRepository.findAllByBuildingId(buildingId,pageable);

        if (apartmentsPageOpt.isEmpty()){
            throw new ApartmentNotFoundInBuildingException(buildingId);
        }

        Page<Apartment> apartmentsPage = apartmentsPageOpt.get();

        Page<ApartmentDTO> dtoPage = apartmentsPage.map(this::mapToDto);
        return CompletableFuture.completedFuture(dtoPage);

    }

    @Async("asyncExecutor")
    @Cacheable(value = "availableApartmentsByBuilding")
    public CompletableFuture<Page<ApartmentDTO>> getAvailableApartmentsInBuilding(
            Long buildingId,
            Integer page,
            Integer size,
            String sortBy,
            String direction
    ){
        Sort sort;

        if (direction.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Optional<Page<Apartment>> apartmentsPageOpt = apartmentRepository.findAllAvailableByBuildingId(buildingId,ApartmentStatus.AVAILABLE, pageable);

        if (apartmentsPageOpt.isEmpty()){
            throw new ApartmentNotFoundInBuildingException(buildingId);
        }

        Page<Apartment> apartmentsPage = apartmentsPageOpt.get();

        Page<ApartmentDTO> dtoPage = apartmentsPage.map(this::mapToDto);
        return CompletableFuture.completedFuture(dtoPage);
    }

    public ApartmentDTO getApartmentById(Long apartmentId){

        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(()-> new ApartmentNotFoundException(apartmentId));

        return mapToDto(apartment);

    }

    @Async("asyncExecutor")
    @Cacheable(value = "apartmentByFloorAndBuilding")
    public CompletableFuture<Page<ApartmentDTO>> getApartmentsByFloorAndBuilding(
            Long buildingId,
            Integer floorNumber,
            Integer page,
            Integer size,
            String sortBy,
            String direction
    ){

        Sort sort;

        if (direction.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Optional<Page<Apartment>> apartmentsPageOpt = apartmentRepository.findAllByFloorAndBuilding(buildingId,floorNumber,pageable);

        if (apartmentsPageOpt.isEmpty()){
            throw new ApartmentNotFoundInBuildingException(buildingId, floorNumber);
        }

        Page<Apartment> apartmentsPage = apartmentsPageOpt.get();

        Page<ApartmentDTO> dtoPage = apartmentsPage.map(this::mapToDto);
        return CompletableFuture.completedFuture(dtoPage);

    }

    @Transactional
    public void addUserToApartment(String userEmail, Long apartmentId){

        UserWithRoleDTO currentUser = userService.getCurrentUserWithRole();

        if (currentUser.getRole() != Role.ADMIN){
            throw new InvalidRoleException();
        }

        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (userOpt.isEmpty()){
            throw new UserNotFoundException(userEmail);
        }

        User userToAdd = userOpt.get();

        Optional<Apartment> apartmentOpt = apartmentRepository.findByIdWithBuilding(apartmentId);

        if (apartmentOpt.isEmpty()){
            throw new ApartmentNotFoundException(apartmentId);
        }

        Apartment apartmentToAdd = apartmentOpt.get();

        if (
                apartmentToAdd.getStatus() == ApartmentStatus.OCCUPIED ||
                apartmentToAdd.getStatus() == ApartmentStatus.UNAVAILABLE ||
                apartmentToAdd.getStatus() == ApartmentStatus.PENDING
        ){
            throw new ApartmentIsUnavailableException();
        }

        Integer buildingNumber = apartmentToAdd.getBuilding().getBuildingNumber();
        String buildingAddress = apartmentToAdd.getBuilding().getAddress();

       GroupDTO groupDTO =  groupService.addUserToGroup(buildingNumber,buildingAddress, userToAdd, apartmentToAdd);

       Group group = groupRepository.findById(groupDTO.getGroupId())
                       .orElseThrow(GroupNotFoundException::new);

        userService.promoteUserToResident(currentUser.getId(), userToAdd.getId());

        apartmentToAdd.setOwner(userToAdd);
        apartmentToAdd.setStatus(ApartmentStatus.OCCUPIED);

        eventPublisher.publishEvent(
                new UserJoinedEvent(apartmentToAdd, userToAdd, group)
        );

        cacheService.evictAAllApartmentsByBuildingCache();
        cacheService.evictAllApartmentByFloorAndBuildingCache();
        cacheService.evictAvailableApartmentsInBuildingCache();

        apartmentRepository.save(apartmentToAdd);
    }

    @Transactional
    public void removeUserFromApartment(RemovalDTO removalDTO, Principal principal){

        Long apartmentId = removalDTO.getTargetId();

        try{

            User user = userService.getUserFromPrincipal(principal);

            UserWithRoleDTO currentAdmin = UserWithRoleDTO.builder()
                    .id(user.getId())
                    .userName(user.getEmail())
                    .role(user.getRole())
                    .build();

            if (currentAdmin.getRole() != Role.ADMIN){
                throw new InvalidRoleException();
            }

            Optional<Apartment> apartmentOpt = apartmentRepository.findUserAndBuildingWithApartmentId(apartmentId);

            if (apartmentOpt.isEmpty()){
                throw new ApartmentNotFoundException(apartmentId);
            }

            Apartment usersApartment = apartmentOpt.get();
            User userToRemove = usersApartment.getOwner();
            Building apartmentsBuilding = usersApartment.getBuilding();

            validateInputs(usersApartment, userToRemove, apartmentsBuilding);

            usersApartment.setOwner(null);

            userToRemove.getOwnedApartments().remove(usersApartment);
            usersApartment.setStatus(ApartmentStatus.AVAILABLE);

            apartmentRepository.save(usersApartment);

            groupService.removeUserFromGroup(usersApartment, userToRemove, apartmentsBuilding.getBuildingNumber(), apartmentsBuilding.getAddress());

            userService.demoteResidentToUser(currentAdmin.getId(), userToRemove.getId());

            Optional<List<Report>> usersSubmittedReportsOpt = reportRepository.findReportByUser(userToRemove.getId(), ReportStatus.SUBMITTED);
            Optional<List<Report>> usersInProgressReportOpt = reportRepository.findReportByUser(userToRemove.getId(), ReportStatus.IN_PROGRESS);

            if (usersSubmittedReportsOpt.isPresent()){

                List<Report> userSubmittedReports = usersSubmittedReportsOpt.get();

                userSubmittedReports.forEach(
                        report -> report.setReportStatus(ReportStatus.CANCELLED)
                );

            }

            if (usersInProgressReportOpt.isPresent()){

                List<Report> usersInProgressReports = usersInProgressReportOpt.get();

                usersInProgressReports.forEach(
                        report -> report.setSystemMessage("[SYSTEM] : The user has been removed from the system in the process.")
                );

            }

            cacheService.evictAAllApartmentsByBuildingCache();
            cacheService.evictAllApartmentByFloorAndBuildingCache();
            cacheService.evictAvailableApartmentsInBuildingCache();
            cacheService.evictAllPublicReportsByStatusCache();

        }catch (ObjectOptimisticLockingFailureException ex){

            throw new MultipleModificationException();

        }

    }

    private void validateInputs(Apartment apartment, User user, Building building){

        if (apartment == null || user == null || building == null){
            throw new InvalidInputsException();
        }

    }

    private ApartmentDTO mapToDto(Apartment apartment){

        return ApartmentDTO.builder()
                .id(apartment.getId())
                .apartmentNumber(apartment.getApartmentNumber())
                .floorNumber(apartment.getFloor())
                .ownerName(apartment.getOwner() != null ? apartment.getOwner().getName() : "UNASSIGNED")
                .status(apartment.getStatus())
                .build();

    }

}
