package org.example.condominiumfaultreportingsystem.company;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.building.Building;
import org.example.condominiumfaultreportingsystem.feedback.Feedback;
import org.example.condominiumfaultreportingsystem.security.user.User;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "companies")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedEntityGraphs({
        @NamedEntityGraph(
                name = "Company.withUser",
                attributeNodes = @NamedAttributeNode("user")
        ),
        @NamedEntityGraph(
                name = "Company.withBuildings",
                attributeNodes = @NamedAttributeNode("buildings")
        ),
        @NamedEntityGraph(
                name = "Company.withFeedbacks",
                attributeNodes = @NamedAttributeNode("feedbacks")
        )
})
public class Company {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String email;
    private String phoneNumber;
    private String address;

    private String companyIntroduction;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    @ManyToMany(mappedBy = "companies", fetch = FetchType.LAZY)
    private List<Building> buildings = new ArrayList<>();

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Feedback> feedbacks = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

}
