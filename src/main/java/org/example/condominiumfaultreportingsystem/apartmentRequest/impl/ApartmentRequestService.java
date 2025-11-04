package org.example.condominiumfaultreportingsystem.apartmentRequest.impl;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.*;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentRepository;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentStatus;
import org.example.condominiumfaultreportingsystem.apartmentRequest.*;
import org.example.condominiumfaultreportingsystem.cache.CacheService;
import org.example.condominiumfaultreportingsystem.eventHandler.events.ApartmentRequestAcceptedEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.ApartmentRequestRejectedEvent;
import org.example.condominiumfaultreportingsystem.exception.*;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.group.GroupRepository;
import org.example.condominiumfaultreportingsystem.group.impl.GroupService;
import org.example.condominiumfaultreportingsystem.notificationHandler.NotificationType;
import org.example.condominiumfaultreportingsystem.notificationHandler.notifications.ApartmentNotification;
import org.example.condominiumfaultreportingsystem.security.user.Role;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.example.condominiumfaultreportingsystem.security.user.UserRepository;
import org.example.condominiumfaultreportingsystem.security.user.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApartmentRequestService implements IApartmentRequestService {

    private final ApartmentRepository apartmentRepository;
    private final ApartmentRequestRepository apartmentRequestRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    private final UserService userService;
    private final GroupService groupService;
    private final CacheService cacheService;

    private final SimpMessagingTemplate messagingTemplate;
    private final ApplicationEventPublisher eventPublisher;


    @Value("${admin.group.name}")
    private String adminGroupName;

    @Transactional
    public ApartmentRequestInfoDTO sendApartmentRequest(ApartmentRequestDTO apartmentRequestDTO){

        try{

            UserDTO currentUser = userService.getCurrentUser();

            Long requestedApartmentId = apartmentRequestDTO.getRequestedApartmentId();
            Long buildingId = apartmentRequestDTO.getBuildingId();

            Optional<Apartment> apartmentOpt = apartmentRepository.findApartment(requestedApartmentId,buildingId);

            if (apartmentOpt.isEmpty()){
                throw new ApartmentNotFoundException(requestedApartmentId);
            }

            Apartment requestedApartment = apartmentOpt.get();


            if (
                    requestedApartment.getStatus() == ApartmentStatus.UNAVAILABLE ||
                            requestedApartment.getStatus() == ApartmentStatus.PENDING ||
                            requestedApartment.getStatus() == ApartmentStatus.OCCUPIED
            ){
                throw new ApartmentRequestAlreadyPendingException();
            }

            ApartmentRequest request = ApartmentRequest.builder()
                    .requesterId(currentUser.getId())
                    .requesterName(currentUser.getUserName())
                    .apartment(requestedApartment)
                    .status(ApartmentRequestStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            apartmentRequestRepository.save(request);

            Optional<Group> adminGroupOpt = groupRepository.findByGroupName(adminGroupName);

            if (adminGroupOpt.isEmpty()){
                throw new GroupNotFoundException();
            }

            Group adminGroup = adminGroupOpt.get();
            Long adminGroupId = adminGroup.getId();

            ApartmentNotification apartmentNotification = ApartmentNotification.builder()
                    .senderName(currentUser.getUserName())
                    .apartmentId(requestedApartmentId)
                    .apartmentNumber(requestedApartment.getApartmentNumber())
                    .floor(requestedApartment.getFloor())
                    .apartmentStatus(requestedApartment.getStatus())
                    .buildingNumber(requestedApartment.getBuilding().getBuildingNumber())
                    .message("New apartment request came!")
                    .type(NotificationType.REQUEST)
                    .build();

            messagingTemplate.convertAndSend("/topic/group/" + adminGroupId, apartmentNotification);

            return mapToDto(request);

        }catch (ObjectOptimisticLockingFailureException ex){

            throw new MultipleModificationException();

        }
    }

    @Transactional
    public void sendApartmentRequestResponse(RequestResponseDTO responseDTO){

        UserWithRoleDTO currentAdmin = userService.getCurrentUserWithRole();

        Long requestId = responseDTO.getRequestId();

        if (currentAdmin.getRole() != Role.ADMIN){
            throw new InvalidRoleException();
        }

        ApartmentRequest apartmentRequest = apartmentRequestRepository.findWithApartmentById(requestId)
                .orElseThrow(()-> new RequestNotFoundException(requestId));

        if (apartmentRequest.getStatus() != ApartmentRequestStatus.PENDING){
            throw new InvalidRequestException(apartmentRequest.getStatus());
        }

        if (responseDTO.getStatus() == RequestResponseStatus.ACCEPTED){

            apartmentRequest.getApartment().setStatus(ApartmentStatus.PENDING);
            acceptRequest(apartmentRequest, currentAdmin);

            cacheService.evictAAllApartmentsByBuildingCache();
            cacheService.evictAllApartmentByFloorAndBuildingCache();

        } else if (responseDTO.getStatus() == RequestResponseStatus.REJECTED) {

            rejectRequest(apartmentRequest);

        } else{
            throw new RequestStatusNotValidException("The apartmentRequest needs to have a status");
        }

    }

    public List<ApartmentRequestInfoDTO> getAllPendingRequests(){

        List<ApartmentRequest> apartmentRequests =  apartmentRequestRepository.findByStatus(ApartmentRequestStatus.PENDING);

        return apartmentRequests.stream().map(apartmentRequest ->
                ApartmentRequestInfoDTO.builder()
                        .requestId(apartmentRequest.getId())
                        .requesterId(apartmentRequest.getRequesterId())
                        .apartmentId(apartmentRequest.getApartment().getId())
                        .status(apartmentRequest.getStatus())
                        .createdAt(apartmentRequest.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

    }

    private void acceptRequest(ApartmentRequest apartmentRequest, UserWithRoleDTO currentAdmin){

        Apartment apartment = apartmentRequest.getApartment();

        User userToAdd  = userRepository.findById(apartmentRequest.getRequesterId())
                        .orElseThrow(()-> new UserNotFoundException(apartmentRequest.getRequesterId()));

        apartment.setOwner(userToAdd);
        userToAdd.getOwnedApartments().add(apartment);
        apartment.setStatus(ApartmentStatus.OCCUPIED);
        apartmentRepository.save(apartment);

        apartmentRequest.setStatus(ApartmentRequestStatus.ACCEPTED);
        apartmentRequestRepository.save(apartmentRequest);

        Integer buildingNumber = apartment.getBuilding().getBuildingNumber();
        String buildingAddress = apartment.getBuilding().getAddress();

        GroupDTO usersGroup = groupService.addUserToGroup(buildingNumber,buildingAddress, userToAdd);

        userService.promoteUserToResident(currentAdmin.getId(),userToAdd.getId());

        eventPublisher.publishEvent(
                new ApartmentRequestAcceptedEvent(apartmentRequest,apartment,usersGroup)
        );

    }

    private void rejectRequest(ApartmentRequest apartmentRequest){

        Apartment apartment = apartmentRequest.getApartment();

        apartmentRequest.setStatus(ApartmentRequestStatus.REJECTED);
        apartmentRequestRepository.save(apartmentRequest);

        eventPublisher.publishEvent(
                new ApartmentRequestRejectedEvent(apartmentRequest,apartment)
        );

    }

    private ApartmentRequestInfoDTO mapToDto(ApartmentRequest apartmentRequest){

        return ApartmentRequestInfoDTO.builder()
                .requestId(apartmentRequest.getId())
                .requesterId(apartmentRequest.getRequesterId())
                .apartmentId(apartmentRequest.getApartment().getId())
                .status(apartmentRequest.getStatus())
                .createdAt(apartmentRequest.getCreatedAt())
                .build();
    }


}
