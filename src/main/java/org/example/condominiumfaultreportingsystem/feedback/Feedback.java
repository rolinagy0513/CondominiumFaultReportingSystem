package org.example.condominiumfaultreportingsystem.feedback;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.Company;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "feedbacks")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue
    Long id;

    @Min(1)
    @Max(5)
    private Integer rating;
    private String message;
    private LocalDateTime createdAt;

    private String reviewerEmail;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

}
