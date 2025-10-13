package org.example.condominiumfaultreportingsystem.apartmentRequest;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "apartment-requests")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedEntityGraph(
        name = "ApartmentRequest.withApartmentAndBuilding",
        attributeNodes = {
                @NamedAttributeNode(value = "apartment", subgraph = "apartment.building")
        },
        subgraphs = {
                @NamedSubgraph(
                        name = "apartment.building",
                        attributeNodes = @NamedAttributeNode("building")
                )
        }
)
public class ApartmentRequest {

    @Id
    @GeneratedValue
    private Long id;

    private Long requesterId;
    private String requesterName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    @Enumerated(EnumType.STRING)
    private ApartmentRequestStatus status;

    private LocalDateTime createdAt;

}
