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
public class ReportCompletedNotification {

    private String reportName;
    private String companyName;
    private Double cost;

    private String message;
    private NotificationType type;

}
