package org.example.condominiumfaultreportingsystem.DTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.ServiceType;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyWithFeedbacksDTO {

    private Long id;

    private String name;
    private String email;
    private String phoneNumber;
    private String address;

    private Double overallRating;

    private String companyIntroduction;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    private List<FeedbackDTO> feedbacks;

}
