package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.report.ReportPrivacy;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitReportDTO {

    private Long reportId;
    private Long companyId;
    private ReportPrivacy reportPrivacy;

}
