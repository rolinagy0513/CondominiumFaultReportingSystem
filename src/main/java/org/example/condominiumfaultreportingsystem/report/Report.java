package org.example.condominiumfaultreportingsystem.report;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.security.user.User;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reports")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue
    private Long id;

    private Long groupId;

    @Enumerated(EnumType.STRING)
    private ReportPrivacy reportPrivacy;

    private String name;
    private String issueDescription;
    private String comment;
    private Integer roomNumber;
    private Integer floor;

    @Enumerated(EnumType.STRING)
    private ReportStatus reportStatus;

    @Enumerated(EnumType.STRING)
    private ReportType reportType;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;


}
