package org.example.condominiumfaultreportingsystem.building;

import org.example.condominiumfaultreportingsystem.DTO.BuildingDTO;
import org.example.condominiumfaultreportingsystem.DTO.BuildingRequestDTO;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IBuildingService {

    BuildingDTO addNewBuilding(BuildingRequestDTO buildingRequestDTO);
    BuildingDTO removeBuilding(Long buildingId);
    CompletableFuture<List<BuildingDTO>> getAll();
    BuildingDTO getBuildingByApartmentId(Long apartmentId);
    BuildingDTO getById(Long buildingId);
    BuildingDTO getByNumber(Integer buildingNumber);
    List<BuildingDTO> getByAddress(String address);
    CompletableFuture<List<BuildingDTO>> getBuildingsByCompanyId(Long companyId);

}
