package org.example.condominiumfaultreportingsystem.eventHandler.eventListeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.eventHandler.events.NewFeedbackCameEvent;
import org.example.condominiumfaultreportingsystem.notificationHandler.NotificationService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class FeedbackNotificationEventListener {

    private final NotificationService notificationService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleNewFeedbackCameEvent(NewFeedbackCameEvent event) {

        log.info("Event received for the public report with the id of: {}", event.getFeedback().getId());

        try {
            notificationService.sendFeedbackNotification(event.getFeedback(), event.getCompanyId());
        } catch (Exception e) {
            log.error("Failed to send new request event for the company of: {}",
                    event.getCompanyId(), e);
        }
    }

}
