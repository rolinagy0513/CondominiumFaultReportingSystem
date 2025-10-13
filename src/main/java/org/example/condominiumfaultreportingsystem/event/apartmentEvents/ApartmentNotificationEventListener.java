package org.example.condominiumfaultreportingsystem.event.apartmentEvents;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequest;
import org.example.condominiumfaultreportingsystem.notification.ApartmentNotification;
import org.example.condominiumfaultreportingsystem.notification.NotificationType;
import org.example.condominiumfaultreportingsystem.notification.WelcomeUserNotification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApartmentNotificationEventListener {

    private final SimpMessagingTemplate messagingTemplate;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRequestAccepted(ApartmentRequestAcceptedEvent event) {
        try {
            sendAcceptanceNotification(event.getApartmentRequest(),event.getApartment(), event.getGroup());
        } catch (Exception e) {
            log.error("Failed to send acceptance notification for request {}",
                    event.getApartmentRequest().getId(), e);
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRequestRejected(ApartmentRequestRejectedEvent event) {
        try {
            sendRejectNotification(event.getApartmentRequest(), event.getApartment());
        } catch (Exception e) {
            log.error("Failed to send rejection notification for request {}",
                    event.getApartmentRequest().getId(), e);
        }
    }

    private void sendAcceptanceNotification(ApartmentRequest request, Apartment apartment, GroupDTO usersGroup){

        ApartmentNotification notificationForUser = ApartmentNotification.builder()
                .senderName("SYSTEM")
                .apartmentId(apartment.getId())
                .apartmentNumber(apartment.getApartmentNumber())
                .floor(apartment.getFloor())
                .apartmentStatus(apartment.getStatus())
                .buildingNumber(apartment.getBuilding().getBuildingNumber())
                .message("Your Request was accepted. Welcome to the system")
                .type(NotificationType.RESPONSE)
                .build();

        String userIdString = request.getRequesterId().toString();
        messagingTemplate.convertAndSendToUser(userIdString, "/queue/request-response", notificationForUser);

        WelcomeUserNotification welcomeNotification = WelcomeUserNotification.builder()
                .senderName(request.getRequesterName())
                .apartmentNumber(apartment.getApartmentNumber())
                .message(request.getRequesterName() + " has joined the group")
                .type(NotificationType.WELCOME)
                .build();

        String groupDestination = usersGroup.getGroupName();
        messagingTemplate.convertAndSend("/topic/group/" + groupDestination, welcomeNotification);
    }

    private void sendRejectNotification(ApartmentRequest request, Apartment apartment){

        ApartmentNotification notificationForUser = ApartmentNotification.builder()
                .senderName("SYSTEM")
                .apartmentId(apartment.getId())
                .apartmentNumber(apartment.getApartmentNumber())
                .floor(apartment.getFloor())
                .apartmentStatus(apartment.getStatus())
                .buildingNumber(apartment.getBuilding().getBuildingNumber())
                .message("Your Request was rejected. Sorry!")
                .build();

        String userIdString = request.getRequesterId().toString();
        messagingTemplate.convertAndSendToUser(userIdString, "/queue/request-response", notificationForUser);

    }

}
