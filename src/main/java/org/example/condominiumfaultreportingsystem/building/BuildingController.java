package org.example.condominiumfaultreportingsystem.building;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.BuildingDTO;
import org.example.condominiumfaultreportingsystem.DTO.BuildingRequestDTO;
import org.example.condominiumfaultreportingsystem.building.impl.BuildingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/")
public class BuildingController {

    private final BuildingService buildingService;

    @PostMapping("admin/building/addNew")
    public BuildingDTO addNewBuilding(
            @RequestBody BuildingRequestDTO requestDTO
    ) {
        return buildingService.addNewBuilding(requestDTO);
    }

    @GetMapping("resident/building/getBuildingByApartmentId/{apartmentId}")
    public BuildingDTO getBuildingByApartmentId(
            @PathVariable Long apartmentId
    ){
        return buildingService.getBuildingByApartmentId(apartmentId);
    }

    @GetMapping("/building/getAll")
    public CompletableFuture<List<BuildingDTO>> getAll(){
        return buildingService.getAll();
    }

    @GetMapping("/resident/building/getById/{buildingId}")
    public BuildingDTO getById(
            @PathVariable Long buildingId
    ){
        return buildingService.getById(buildingId);
    }

    @GetMapping("/resident/building/getByNumber/{buildingNumber}")
    public BuildingDTO getByNumber(
            @PathVariable Integer buildingNumber
    ){
        return buildingService.getByNumber(buildingNumber);
    }

    @GetMapping("/resident/building/getByAddress")
    public List<BuildingDTO> getByAddress(
            @RequestParam String address
    ){
        return buildingService.getByAddress(address);
    }

    @GetMapping("/company/building/getBuildingsByCompanyId/{companyId}")
    public CompletableFuture<List<BuildingDTO>> getBuildingsByCompanyId(
             @PathVariable Long companyId
    ){
        return buildingService.getBuildingsByCompanyId(companyId);
    }

    @DeleteMapping("/admin/building/removeBuilding/{buildingId}")
    public BuildingDTO removeBuilding(
            @PathVariable Long buildingId
    ){
        return buildingService.removeBuilding(buildingId);
    }

}
