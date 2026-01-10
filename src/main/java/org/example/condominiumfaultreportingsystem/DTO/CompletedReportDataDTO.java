package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompletedReportDataDTO {

    private String residentName;
    private String companyName;
    private String reportName;

    private Integer floorNumber;
    private Integer roomNumber;

    private Double cost;

}
