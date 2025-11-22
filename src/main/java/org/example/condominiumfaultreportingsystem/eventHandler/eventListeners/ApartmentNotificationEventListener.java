package org.example.condominiumfaultreportingsystem.eventHandler.eventListeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.eventHandler.events.ApartmentRequestAcceptedEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.ApartmentRequestRejectedEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.UserLeftEvent;
import org.example.condominiumfaultreportingsystem.notificationHandler.NotificationService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApartmentNotificationEventListener {

    private final NotificationService notificationService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRequestAccepted(ApartmentRequestAcceptedEvent event) {

        log.info("Event received: {}", event.getApartmentRequest().getId());

        try {
            notificationService.sendApartmentRequestAcceptedNotification(event.getApartmentRequest(),event.getApartment(), event.getGroup());
        } catch (Exception e) {
            log.error("Failed to send acceptance notification for request {}",
                    event.getApartmentRequest().getId(), e);
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRequestRejected(ApartmentRequestRejectedEvent event) {
        try {
            notificationService.sendApartmentRequestRejectedNotification(event.getApartmentRequest(), event.getApartment());
        } catch (Exception e) {
            log.error("Failed to send rejection notification for request {}",
                    event.getApartmentRequest().getId(), e);
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUserLeftEvent(UserLeftEvent event){
        try{
            notificationService.sendUserLeftNotification(event.getApartment(), event.getUser(), event.getGroup());
        }catch (Exception e){
            log.error("Failed to send the user left event to: {}",
                    event.getUser().getName());
        }
    }

}
