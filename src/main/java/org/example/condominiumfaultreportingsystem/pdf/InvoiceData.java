package org.example.condominiumfaultreportingsystem.pdf;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.ServiceType;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceData {

    private String invoiceNumber;

    private String customerName;
    private Integer buildingNumber;
    private Integer roomNumber;

    private String companyName;
    private String reportName;

    private Double cost;

    private LocalDateTime payedAt;

}
