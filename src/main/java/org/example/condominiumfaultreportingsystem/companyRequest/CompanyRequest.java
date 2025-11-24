package org.example.condominiumfaultreportingsystem.companyRequest;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.ServiceType;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "company_requests")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRequest {

    @Id
    @GeneratedValue
    private Long id;

    private Long requesterId;

    private String requesterName;

    private Long buildingId;
    private Integer buildingNumber;
    private String buildingAddress;

    private String companyName;
    private String companyEmail;
    private String companyPhoneNumber;
    private String companyAddress;

    private String companyIntroduction;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    @Enumerated(EnumType.STRING)
    private CompanyRequestStatus status;

    private LocalDateTime createdAt;

    @Version
    private Long version;

}
