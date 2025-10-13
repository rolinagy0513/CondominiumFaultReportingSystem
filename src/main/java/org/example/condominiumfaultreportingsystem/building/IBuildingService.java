package org.example.condominiumfaultreportingsystem.building;

import org.example.condominiumfaultreportingsystem.DTO.BuildingDTO;
import org.example.condominiumfaultreportingsystem.DTO.BuildingRequestDTO;

import java.util.List;

public interface IBuildingService {

    BuildingDTO addNewBuilding(BuildingRequestDTO buildingRequestDTO);
    BuildingDTO removeBuilding(Long buildingId);
    BuildingDTO getById(Long buildingId);
    BuildingDTO getByNumber(Integer buildingNumber);
    List<BuildingDTO> getByAddress(String address);

}
