package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.ServiceType;
import org.example.condominiumfaultreportingsystem.company.priceRange.CurrencyType;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompletedReportDataDTO {

    private Long reportId;

    private String residentName;

    private String companyName;
    private String companyEmail;
    private ServiceType serviceType;

    private String reportName;

    private Integer floorNumber;
    private Integer roomNumber;

    private Double cost;
    private CurrencyType currencyType;

}
