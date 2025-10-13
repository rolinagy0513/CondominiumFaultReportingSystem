package org.example.condominiumfaultreportingsystem.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WelcomeUserNotification {

    private String senderName;
    private Integer apartmentNumber;

    private String message;
    private NotificationType type;

}
