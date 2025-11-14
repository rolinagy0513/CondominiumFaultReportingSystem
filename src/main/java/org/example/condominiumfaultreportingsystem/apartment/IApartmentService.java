package org.example.condominiumfaultreportingsystem.apartment;

import org.example.condominiumfaultreportingsystem.DTO.ApartmentDTO;
import org.example.condominiumfaultreportingsystem.DTO.RemovalDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.concurrent.CompletableFuture;

public interface IApartmentService {

    CompletableFuture<Page<ApartmentDTO>> getApartmentsInBuilding(Long buildingId, Integer page, Integer size, String sortBy, String direction);
    ApartmentDTO getApartmentById(Long apartmentId);
    CompletableFuture<Page<ApartmentDTO>> getAvailableApartmentsInBuilding(Long buildingId, Integer page, Integer size, String sortBy, String direction);
    CompletableFuture<Page<ApartmentDTO>> getApartmentsByFloorAndBuilding(Long buildingId, Integer floorNumber, Integer page, Integer size, String sortBy, String direction);
    void removeUserFromApartment(RemovalDTO removalDTO, Principal principal);

}
