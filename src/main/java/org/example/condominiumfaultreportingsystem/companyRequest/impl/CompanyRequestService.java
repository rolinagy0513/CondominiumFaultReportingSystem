package org.example.condominiumfaultreportingsystem.companyRequest.impl;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.*;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequest;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequestRepository;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequestStatus;
import org.example.condominiumfaultreportingsystem.apartmentRequest.RequestResponseStatus;
import org.example.condominiumfaultreportingsystem.building.Building;
import org.example.condominiumfaultreportingsystem.building.BuildingRepository;
import org.example.condominiumfaultreportingsystem.cache.CacheService;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.company.CompanyRepository;
import org.example.condominiumfaultreportingsystem.company.ServiceType;
import org.example.condominiumfaultreportingsystem.companyRequest.*;
import org.example.condominiumfaultreportingsystem.eventHandler.events.CompanyRequestAcceptedEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.CompanyRequestRejectedEvent;
import org.example.condominiumfaultreportingsystem.exception.*;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.group.GroupRepository;
import org.example.condominiumfaultreportingsystem.group.impl.GroupService;
import org.example.condominiumfaultreportingsystem.notificationHandler.notifications.CompanyNotification;
import org.example.condominiumfaultreportingsystem.notificationHandler.NotificationType;
import org.example.condominiumfaultreportingsystem.security.user.Role;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.example.condominiumfaultreportingsystem.security.user.UserRepository;
import org.example.condominiumfaultreportingsystem.security.user.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.plaf.OptionPaneUI;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyRequestService implements ICompanyRequestService {

    private final CompanyRequestRepository companyRequestRepository;
    private final CompanyRepository companyRepository;
    private final BuildingRepository buildingRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    private final UserService userService;
    private final GroupService groupService;
    private final CacheService cacheService;

    private final SimpMessagingTemplate messagingTemplate;
    private final ApplicationEventPublisher eventPublisher;
    private final ApartmentRequestRepository apartmentRequestRepository;

    @Value("${admin.group.name}")
    private String adminGroupName;

    @Transactional
    public CompanyRequestInfoDTO sendCompanyRequest(CompanyRequestDTO companyRequestDTO, Principal principal){

        User user = userService.getUserFromPrincipal(principal);

        UserWithRoleDTO currentUser = UserWithRoleDTO.builder()
                .id(user.getId())
                .userName(user.getEmail())
                .role(user.getRole())
                .build();

        try{

            if (currentUser.getRole() == Role.COMPANY || currentUser.getRole() == Role.RESIDENT){
                throw new InvalidRoleException();
            }

            validateUserCanCreateRequest(currentUser.getId());

            CompanyRequest newRequest = CompanyRequest.builder()
                    .requesterId(currentUser.getId())
                    .requesterName(currentUser.getUserName())
                    .buildingId(companyRequestDTO.getBuildingId())
                    .buildingNumber(companyRequestDTO.getBuildingNumber())
                    .buildingAddress(companyRequestDTO.getBuildingAddress())
                    .companyName(companyRequestDTO.getCompanyName())
                    .companyEmail(companyRequestDTO.getCompanyEmail())
                    .companyPhoneNumber(companyRequestDTO.getCompanyPhoneNumber())
                    .companyAddress(companyRequestDTO.getCompanyAddress())
                    .companyIntroduction(companyRequestDTO.getCompanyIntroduction())
                    .serviceType(companyRequestDTO.getServiceType())
                    .status(CompanyRequestStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            companyRequestRepository.save(newRequest);


            Optional<Group> adminGroupOpt = groupRepository.findByGroupName(adminGroupName);

            if (adminGroupOpt.isEmpty()){
                throw new GroupNotFoundException();
            }

            Group adminGroup = adminGroupOpt.get();
            Long adminGroupId = adminGroup.getId();

            CompanyNotification companyNotification = CompanyNotification.builder()
                    .senderName(currentUser.getUserName())
                    .companyName(companyRequestDTO.getCompanyName())
                    .companyEmail(companyRequestDTO.getCompanyEmail())
                    .serviceType(companyRequestDTO.getServiceType())
                    .type(NotificationType.COMPANY_REQUEST)
                    .message("New company request came!")
                    .build();

            messagingTemplate.convertAndSend("/topic/group/" + adminGroupId, companyNotification);

            return mapToDto(newRequest);

        }catch (DataIntegrityViolationException ex){

            throw new ExistingPendingRequestException();

        }

    }

    @Transactional
    public void sendCompanyRequestResponse(RequestResponseDTO responseDTO, Principal principal){

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

            CompanyRequest request = companyRequestRepository.findById(responseDTO.getRequestId())
                    .orElseThrow(()-> new RequestNotFoundException(responseDTO.getRequestId()));

            if (request.getStatus() != CompanyRequestStatus.PENDING){
                throw new InvalidRequestException(request.getStatus());
            }

            if (responseDTO.getStatus() == RequestResponseStatus.ACCEPTED){
                acceptRequest(request, currentAdmin.getId());

            } else if (responseDTO.getStatus() == RequestResponseStatus.REJECTED) {
                rejectRequest(request);
            }
            else {
                throw new RequestStatusNotValidException("The companyRequest needs to have a status");
            }

        }catch (ObjectOptimisticLockingFailureException ex){

            throw new MultipleModificationException();

        }

    }

    public List<CompanyRequestInfoDTO> getAllPendingRequests(){

        List<CompanyRequest> companyRequests = companyRequestRepository.findByStatus(CompanyRequestStatus.PENDING);

        return companyRequests.stream().map(companyRequest ->
                CompanyRequestInfoDTO.builder()
                        .requestId(companyRequest.getId())
                        .requesterId(companyRequest.getRequesterId())
                        .requesterName(companyRequest.getRequesterName())
                        .buildingId(companyRequest.getBuildingId())
                        .buildingAddress(companyRequest.getBuildingAddress())
                        .buildingNumber(companyRequest.getBuildingNumber())
                        .name(companyRequest.getCompanyName())
                        .email(companyRequest.getCompanyEmail())
                        .phoneNumber(companyRequest.getCompanyPhoneNumber())
                        .address(companyRequest.getCompanyAddress())
                        .status(companyRequest.getStatus())
                        .serviceType(companyRequest.getServiceType())
                        .createdAt(companyRequest.getCreatedAt())
                        .build())
                .toList();
    }

    private void acceptRequest(CompanyRequest companyRequest, Long currentUserId){

        Building building = buildingRepository.findById(companyRequest.getBuildingId())
                .orElseThrow(()-> new BuildingIsNotFoundException(companyRequest.getBuildingId()));

        User user = userRepository.findById(companyRequest.getRequesterId())
                .orElseThrow(()-> new UserNotFoundException(companyRequest.getRequesterId()));

        userService.promoteUserToCompany(currentUserId, user.getId());

        Company newCompany = Company.builder()
                .name(companyRequest.getCompanyName())
                .email(companyRequest.getCompanyEmail())
                .phoneNumber(companyRequest.getCompanyPhoneNumber())
                .address(companyRequest.getCompanyAddress())
                .companyIntroduction(companyRequest.getCompanyIntroduction())
                .serviceType(companyRequest.getServiceType())
                .buildings(new ArrayList<>())
                .user(user)
                .build();

        companyRepository.save(newCompany);

        building.getCompanies().add(newCompany);
        buildingRepository.save(building);

        companyRequest.setStatus(CompanyRequestStatus.ACCEPTED);
        companyRequestRepository.save(companyRequest);

        Long buildingId = building.getId();
        ServiceType serviceType = newCompany.getServiceType();

        cacheService.evictCompanyByBuildingCache(buildingId);
        cacheService.evictCompanyByServiceTypeCache();
        cacheService.evictCompanyByBuildingIdAndServiceTypeCache(buildingId, serviceType);
        cacheService.evictAllCompaniesCache();

        GroupDTO companyGroup = groupService.addUserToGroup(companyRequest.getBuildingNumber(), companyRequest.getBuildingAddress(), user, null);

        eventPublisher.publishEvent(
                new CompanyRequestAcceptedEvent(companyRequest, companyGroup)
        );

    }

    private void rejectRequest(CompanyRequest companyRequest){

        companyRequest.setStatus(CompanyRequestStatus.REJECTED);
        companyRequestRepository.save(companyRequest);

        eventPublisher.publishEvent(
                new CompanyRequestRejectedEvent(companyRequest)
        );


    }

    public ActiveCompanyRequest getActiveRequest(Long userId){

        Optional<CompanyRequest> companyRequestOpt = companyRequestRepository.findByRequesterIdAndStatus(userId, CompanyRequestStatus.PENDING);

        if (companyRequestOpt.isEmpty()){
            return ActiveCompanyRequest.NONE;
        }

        CompanyRequest companyRequest = companyRequestOpt.get();

        if (companyRequest.getStatus() != CompanyRequestStatus.PENDING){
            throw new InvalidRequestStatusException();
        }

        return ActiveCompanyRequest.ACTIVE;
    }

    private void validateUserCanCreateRequest(Long userId) {

        Optional<ApartmentRequest> apartmentRequestOpt = apartmentRequestRepository.findByRequesterIdAndStatus(userId, ApartmentRequestStatus.PENDING);

        if (apartmentRequestOpt.isPresent()){
            throw new UserAlreadyHasRequestException(
                    "You already submitted a request to be a resident in the system. You need to wait until it is sorted out to send another request."
            );
        }

        Optional<Company> existingCompanyForUser = companyRepository.findCompanyWithUser(userId);

        if (existingCompanyForUser.isPresent()) {
            throw new UserAlreadyHasCompanyException(userId);
        }

        Optional<CompanyRequest> existingPendingRequest =
                companyRequestRepository.existsForUserWithStatus(userId, CompanyRequestStatus.PENDING);

        if (existingPendingRequest.isPresent()) {
            throw new ExistingPendingRequestException(userId);
        }
    }

    private CompanyRequestInfoDTO mapToDto(CompanyRequest companyRequest){

        return CompanyRequestInfoDTO.builder()
                .requestId(companyRequest.getId())
                .requesterId(companyRequest.getRequesterId())
                .name(companyRequest.getCompanyName())
                .email(companyRequest.getCompanyEmail())
                .phoneNumber(companyRequest.getCompanyPhoneNumber())
                .address(companyRequest.getCompanyAddress())
                .serviceType(companyRequest.getServiceType())
                .status(companyRequest.getStatus())
                .createdAt(companyRequest.getCreatedAt())
                .build();

    }


}
