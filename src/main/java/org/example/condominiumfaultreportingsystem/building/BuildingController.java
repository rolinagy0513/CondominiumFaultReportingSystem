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

    @GetMapping("/admin/building/getAll")
    public CompletableFuture<List<BuildingDTO>> getAll(){
        return buildingService.getAll();
    }

    @GetMapping("building/getById/{buildingId}")
    public BuildingDTO getById(
            @PathVariable Long buildingId
    ){
        return buildingService.getById(buildingId);
    }

    @GetMapping("building/getByNumber/{buildingNumber}")
    public BuildingDTO getByNumber(
            @PathVariable Integer buildingNumber
    ){
        return buildingService.getByNumber(buildingNumber);
    }

    @GetMapping("building/getByAddress")
    public List<BuildingDTO> getByAddress(
            @RequestParam String address
    ){
        return buildingService.getByAddress(address);
    }

    @DeleteMapping("/admin/building/removeBuilding/{buildingId}")
    public BuildingDTO removeBuilding(
            @PathVariable Long buildingId
    ){
        return buildingService.removeBuilding(buildingId);
    }

}
