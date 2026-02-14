package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.ServiceType;
import org.example.condominiumfaultreportingsystem.company.priceRange.PriceRange;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRequestDTO {

    private Long buildingId;
    private Integer buildingNumber;
    private String buildingAddress;

    private String companyName;
    private String companyEmail;
    private String companyPhoneNumber;
    private String companyAddress;

    private String companyIntroduction;

    private PriceRange priceRange;

    private ServiceType serviceType;

}
