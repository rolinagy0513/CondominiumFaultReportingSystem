package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingRequestDTO {

    private Integer numberOfFloors;
    private Integer numberOfApartmentsInOneFloor;

    private Integer buildingNumber;
    private String address;

    private List<FloorOverrideDTO> overrides;

}
