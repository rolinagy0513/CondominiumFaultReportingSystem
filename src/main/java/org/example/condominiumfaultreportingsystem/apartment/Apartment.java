package org.example.condominiumfaultreportingsystem.apartment;

import jakarta.persistence.*;
import lombok.*;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequest;
import org.example.condominiumfaultreportingsystem.building.Building;
import org.example.condominiumfaultreportingsystem.security.user.User;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "apartments")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedEntityGraphs({
        @NamedEntityGraph(
                name = "Apartment.withUser",
                attributeNodes = @NamedAttributeNode("owner")
        ),
        @NamedEntityGraph(
                name = "Apartment.withBuilding",
                attributeNodes = @NamedAttributeNode("building")
        ),
        @NamedEntityGraph(
                name = "Apartment.withUserAndBuilding",
                attributeNodes = {
                        @NamedAttributeNode("owner"),
                        @NamedAttributeNode("building")
                }
        )
})
public class Apartment {

    @Id
    @GeneratedValue
    private Long id;

    private Integer floor;
    private Integer apartmentNumber;

    @Enumerated(EnumType.STRING)
    private ApartmentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id")
    private Building building;

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApartmentRequest> requests = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Version
    private Long version;

}
