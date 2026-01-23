package org.example.condominiumfaultreportingsystem.DTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.ServiceType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyAddDTO {

    private String userToAddEmail;

    private Long buildingId;
    private String buildingAddress;
    private Integer buildingNumber;

    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String introduction;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

}
