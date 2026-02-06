package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.ServiceType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EditCompanyDataDTO {

    private Long companyId;
    private String groupIdentifier;

    private String companyName;
    private String companyIntroduction;
    private String companyAddress;
    private String phoneNumber;
    private ServiceType serviceType;


}
