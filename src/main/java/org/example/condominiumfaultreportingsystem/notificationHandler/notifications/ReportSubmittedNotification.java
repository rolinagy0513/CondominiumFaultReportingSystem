package org.example.condominiumfaultreportingsystem.notificationHandler.notifications;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.report.ReportType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportSubmittedNotification {

    private String message;
    private ReportType reportType;
    private String companyName;

}
