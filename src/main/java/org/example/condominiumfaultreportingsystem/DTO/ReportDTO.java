package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.report.ReportPrivacy;
import org.example.condominiumfaultreportingsystem.report.ReportStatus;
import org.example.condominiumfaultreportingsystem.report.ReportType;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDTO {

    private String senderName;

    private Long reportId;
    private ReportPrivacy reportPrivacy;

    private String name;
    private String issueDescription;
    private String comment;
    private Integer roomNumber;
    private Integer floor;

    private LocalDateTime createdAt;

    private ReportStatus reportStatus;
    private ReportType reportType;

}
