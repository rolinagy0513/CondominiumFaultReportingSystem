package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApartmentDTO {

    private Long id;

    private Integer apartmentNumber;
    private Integer floorNumber;
    private String ownerName;
    private ApartmentStatus status;

}
