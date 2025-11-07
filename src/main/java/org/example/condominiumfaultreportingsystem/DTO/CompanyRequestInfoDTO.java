package org.example.condominiumfaultreportingsystem.DTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.ServiceType;
import org.example.condominiumfaultreportingsystem.companyRequest.CompanyRequestStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRequestInfoDTO {

    private Long requestId;
    private Long requesterId;
    private String requesterName;

    private Long buildingId;
    private String buildingAddress;
    private Integer buildingNumber;

    private String name;
    private String email;
    private String phoneNumber;
    private String address;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    private CompanyRequestStatus status;
    private LocalDateTime createdAt;

}
