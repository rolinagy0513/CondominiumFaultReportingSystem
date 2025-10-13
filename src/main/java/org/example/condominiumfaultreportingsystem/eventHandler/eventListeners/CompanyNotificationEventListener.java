package org.example.condominiumfaultreportingsystem.eventHandler.eventListeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.eventHandler.events.CompanyRemovedEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.CompanyRequestAcceptedEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.CompanyRequestRejectedEvent;
import org.example.condominiumfaultreportingsystem.notificationHandler.NotificationService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyNotificationEventListener {

    private final NotificationService notificationService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRequestAccepted(CompanyRequestAcceptedEvent event) {
        try {
            notificationService.sendCompanyRequestAcceptedNotification(event.getCompanyRequest(), event.getGroup());
        } catch (Exception e) {
            log.error("Failed to send acceptance notification for request {}",
                    event.getCompanyRequest().getId(), e);
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRequestRejected(CompanyRequestRejectedEvent event) {
        try {
            notificationService.sendCompanyRequestRejectedNotification(event.getCompanyRequest());
        } catch (Exception e) {
            log.error("Failed to send rejection notification for request {}",
                    event.getCompanyRequest().getId(), e);
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCompanyRemovedEvent(CompanyRemovedEvent event) {
        try {
            notificationService.sendCompanyRemovedNotification(event.getCompany(), event.getUserId(), event.getGroups());
        } catch (Exception e) {
            log.error("Failed to send removal notification for company {}",
                    event.getCompany().getName(), e);
        }
    }

}
