package org.example.condominiumfaultreportingsystem.eventHandler.eventListeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.email.EmailService;
import org.example.condominiumfaultreportingsystem.eventHandler.events.TemporaryPasswordEmailSenderEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailEventListener {

    private final EmailService emailService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleTempPasswordEmailSendEvent(TemporaryPasswordEmailSenderEvent event){

        log.info("Event received for email sending.");

        try {
            emailService.sendTemporaryPasswordEmail(event.getBuildingAddress(), event.getRecipients());
        } catch (Exception e) {
            log.error("Failed to send the emails with the service");
        }

    }

}
