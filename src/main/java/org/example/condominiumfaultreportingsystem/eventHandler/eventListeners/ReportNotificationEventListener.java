package org.example.condominiumfaultreportingsystem.eventHandler.eventListeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.eventHandler.events.NewPrivateReportCameEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.NewPublicReportCameEvent;
import org.example.condominiumfaultreportingsystem.notificationHandler.NotificationService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReportNotificationEventListener {

    private final NotificationService notificationService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleNewPublicReportCame(NewPublicReportCameEvent event) {

        log.info("Event received for the public report with the id of: {}", event.getReport().getId());

        try {
            notificationService.sendNewPublicReportCameNotification(event.getGroupName(), event.getUserName(), event.getReport());
        } catch (Exception e) {
            log.error("Failed to send new request event for the group of: {}",
                    event.getGroupName(), e);
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleNewPrivateReportCame(NewPrivateReportCameEvent event) {

        log.info("Event received for the private report with the id of: {}", event.getReport().getId());

        try {
            notificationService.sendNewPrivateReportCameNotification(event.getCompanyId(), event.getUserName(), event.getReport());
        } catch (Exception e) {
            log.error("Failed to send new request event for the group of: {}",
                    event.getCompanyId(), e);
        }
    }

}
