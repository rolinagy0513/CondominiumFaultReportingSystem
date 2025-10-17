package org.example.condominiumfaultreportingsystem.apartment;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.ApartmentDTO;
import org.example.condominiumfaultreportingsystem.apartment.impl.ApartmentService;
import org.springframework.data.domain.Page;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@Controller
@RequiredArgsConstructor
@RequestMapping("api/")
public class ApartmentController {


    private final ApartmentService apartmentService;

    @GetMapping("/apartment/getByBuildingId/{buildingId}")
    public CompletableFuture<Page<ApartmentDTO>> getApartmentsInBuilding(
            @PathVariable Long buildingId,

            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ){
        return apartmentService.getApartmentsInBuilding(buildingId, page, size, sortBy, direction);
    }

    @GetMapping("/apartment/getById/{apartmentId}")
    public ApartmentDTO getApartmentById(
            @PathVariable Long apartmentId
    ){
        return apartmentService.getApartmentById(apartmentId);
    }

    @GetMapping("/apartment/getByFloorAndBuilding/{buildingId}/{floorNumber}")
    public CompletableFuture<Page<ApartmentDTO>> getApartmentsByFloorAndBuilding(
            @PathVariable Long buildingId,
            @PathVariable Integer floorNumber,

            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ){
        return apartmentService.getApartmentsByFloorAndBuilding(buildingId,floorNumber, page,size,sortBy,direction);
    }

    @MessageMapping("/admin/apartment/removeUserFromApartment/{apartmentId}")
    public void removeUserFromApartment(
            @PathVariable Long apartmentId
    ){
        apartmentService.removeUserFromApartment(apartmentId);
    }

}
