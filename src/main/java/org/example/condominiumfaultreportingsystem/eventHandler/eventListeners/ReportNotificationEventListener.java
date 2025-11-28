package org.example.condominiumfaultreportingsystem.eventHandler.eventListeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public void handleNewReportCame(NewPublicReportCameEvent event) {

        log.info("Event received for the report with the id of: {}", event.getReport().getId());

        try {
            notificationService.sendNewReportCameNotification(event.getGroupName(), event.getUserName(), event.getReport());
        } catch (Exception e) {
            log.error("Failed to send new request event for the group of: {}",
                    event.getGroupName(), e);
        }
    }

}
