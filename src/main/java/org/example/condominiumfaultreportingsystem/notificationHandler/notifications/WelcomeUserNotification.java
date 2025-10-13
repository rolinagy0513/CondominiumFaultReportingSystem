package org.example.condominiumfaultreportingsystem.notificationHandler.notifications;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.notificationHandler.NotificationType;

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
