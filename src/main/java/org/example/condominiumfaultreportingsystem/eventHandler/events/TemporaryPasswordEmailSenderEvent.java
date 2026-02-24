package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.email.TemporaryPasswordRecipient;

import java.util.List;

@Getter
@AllArgsConstructor
public class TemporaryPasswordEmailSenderEvent {

    private String buildingAddress;
    private List<TemporaryPasswordRecipient> recipients;

}
