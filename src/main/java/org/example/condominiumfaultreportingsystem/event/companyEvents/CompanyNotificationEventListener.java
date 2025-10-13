package org.example.condominiumfaultreportingsystem.event.companyEvents;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;
import org.example.condominiumfaultreportingsystem.companyRequest.CompanyRequest;
import org.example.condominiumfaultreportingsystem.notification.CompanyNotification;
import org.example.condominiumfaultreportingsystem.notification.NotificationType;
import org.example.condominiumfaultreportingsystem.notification.WelcomeCompanyNotification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyNotificationEventListener {

    private final SimpMessagingTemplate messagingTemplate;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRequestAccepted(CompanyRequestAcceptedEvent event) {
        try {
            sendAcceptanceNotification(event.getCompanyRequest(), event.getGroup());
        } catch (Exception e) {
            log.error("Failed to send acceptance notification for request {}",
                    event.getCompanyRequest().getId(), e);
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRequestRejected(CompanyRequestRejectedEvent event) {
        try {
            sendRejectNotification(event.getCompanyRequest());
        } catch (Exception e) {
            log.error("Failed to send rejection notification for request {}",
                    event.getCompanyRequest().getId(), e);
        }
    }

    private void sendAcceptanceNotification(CompanyRequest companyRequest, GroupDTO companyGroup){

        CompanyNotification notificationForUser = CompanyNotification.builder()
                .senderName("SYSTEM")
                .companyName(companyRequest.getCompanyName())
                .companyEmail(companyRequest.getCompanyEmail())
                .serviceType(companyRequest.getServiceType())
                .message("Your Request was accepted. Welcome to the system")
                .type(NotificationType.RESPONSE)
                .build();

        String userIdString = companyRequest.getRequesterId().toString();
        messagingTemplate.convertAndSendToUser(userIdString, "/queue/request-response", notificationForUser);

        WelcomeCompanyNotification welcomeNotification = WelcomeCompanyNotification.builder()
                .companyName(companyRequest.getCompanyName())
                .serviceType(companyRequest.getServiceType())
                .message("A new company has joined check out their services")
                .type(NotificationType.WELCOME)
                .build();

        String groupDestination = companyGroup.getGroupName();
        messagingTemplate.convertAndSend("/topic/group/" + groupDestination, welcomeNotification);
    }

    private void sendRejectNotification(CompanyRequest companyRequest){

        CompanyNotification notificationForUser = CompanyNotification.builder()
                .senderName("SYSTEM")
                .companyName(companyRequest.getCompanyName())
                .companyEmail(companyRequest.getCompanyEmail())
                .serviceType(companyRequest.getServiceType())
                .message("Your Request was rejected. Sorry!")
                .type(NotificationType.RESPONSE)
                .build();

        String userIdString = companyRequest.getRequesterId().toString();
        messagingTemplate.convertAndSendToUser(userIdString,"/queue/request-response",notificationForUser);

    }

}
