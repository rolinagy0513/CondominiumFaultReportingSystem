package org.example.condominiumfaultreportingsystem.apartment;

import jakarta.persistence.*;
import lombok.*;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequest;
import org.example.condominiumfaultreportingsystem.building.Building;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "apartments")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Apartment {

    @Id
    @GeneratedValue
    private Long id;

    private Integer floor;
    private Integer apartmentNumber;

    private Long ownerId;

    @Enumerated(EnumType.STRING)
    private ApartmentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id")
    private Building building;

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApartmentRequest> requests = new ArrayList<>();

    @Version
    private Long version;


}
