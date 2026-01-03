package org.example.condominiumfaultreportingsystem.report;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.feedback.Feedback;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.security.user.User;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reports")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedEntityGraphs(
        {
                @NamedEntityGraph(
                        name = "Report.WithGroupAndUser",
                        attributeNodes = {
                                @NamedAttributeNode("group"),
                                @NamedAttributeNode("user")
                        }),
        }
)
public class Report {

    @Id
    @GeneratedValue
    private Long id;

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

    private Long companyId;
    private String companyName;

    @OneToOne(mappedBy = "report", cascade = CascadeType.ALL)
    private Feedback feedback;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;


}
