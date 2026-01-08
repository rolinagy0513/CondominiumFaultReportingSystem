package org.example.condominiumfaultreportingsystem.notificationHandler.notifications;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.notificationHandler.NotificationType;
import org.example.condominiumfaultreportingsystem.report.ReportType;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewReportCameNotification {

    private String message;
    private ReportType reportType;
    private String userName;
    private LocalDateTime submittedAt;

    private NotificationType type;

}
