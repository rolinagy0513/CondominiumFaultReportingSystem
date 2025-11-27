package org.example.condominiumfaultreportingsystem.group;

import jakarta.persistence.*;
import lombok.*;
import org.example.condominiumfaultreportingsystem.report.Report;
import org.example.condominiumfaultreportingsystem.security.user.User;

import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
@Table(name = "groups")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = "users")
@ToString(exclude = "users")
@NamedEntityGraph(
        name = "Group.withUsers",
        attributeNodes = @NamedAttributeNode("users")
)
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String groupName;

    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_groups",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> users = new ArrayList<>();

}
