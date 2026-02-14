package org.example.condominiumfaultreportingsystem.DTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class CompanyDTO {

    private Long id;

    private String name;
    private String email;
    private String phoneNumber;
    private String address;

    private Double overallRating;

    private String companyIntroduction;

    private PriceRange priceRange;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

}
