package org.example.condominiumfaultreportingsystem.building.impl;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.BuildingDTO;
import org.example.condominiumfaultreportingsystem.DTO.BuildingRequestDTO;
import org.example.condominiumfaultreportingsystem.DTO.FloorOverrideDTO;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentRepository;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentStatus;
import org.example.condominiumfaultreportingsystem.building.Building;
import org.example.condominiumfaultreportingsystem.building.BuildingRepository;
import org.example.condominiumfaultreportingsystem.building.IBuildingService;
import org.example.condominiumfaultreportingsystem.exception.BuildingIsNotFoundException;
import org.example.condominiumfaultreportingsystem.exception.BuildingIsPresentException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BuildingService implements IBuildingService {

    private final BuildingRepository buildingRepository;
    private final ApartmentRepository apartmentRepository;

    @Transactional
    public BuildingDTO addNewBuilding(BuildingRequestDTO buildingRequestDTO){

        Integer buildingNumber = buildingRequestDTO.getBuildingNumber();

        Optional<Building> buildingOpt = buildingRepository.findByBuildingNumber(buildingNumber);

        if (buildingOpt.isPresent()){
            throw new BuildingIsPresentException(buildingNumber);
        }

        Building building = Building.builder()
                .buildingNumber(buildingNumber)
                .address(buildingRequestDTO.getAddress())
                .build();

        Integer numberOfFloors = buildingRequestDTO.getNumberOfFloors();
        Integer defaultApartmentsInFloor = buildingRequestDTO.getNumberOfApartmentsInOneFloor();

        Map<Integer, Integer> apartmentsPerFloor = new HashMap<>();

        for (int f = 1; f <= numberOfFloors; f++) {
            apartmentsPerFloor.put(f, defaultApartmentsInFloor);
        }

        if (buildingRequestDTO.getOverrides() != null && !buildingRequestDTO.getOverrides().isEmpty()) {
            for (FloorOverrideDTO override : buildingRequestDTO.getOverrides()) {
                apartmentsPerFloor.put(override.getFloorNumber(), override.getApartmentsOnFloor());
            }
        }

        List<Apartment> apartments = new ArrayList<>(numberOfFloors * defaultApartmentsInFloor);

        for (int floor = 1; floor <= numberOfFloors; floor++) {

            Integer apartmentsInThisFloor = apartmentsPerFloor.get(floor);

            for (int room = 1; room <= apartmentsInThisFloor; room++) {

                Integer apartmentNumber = generateRoomNumber(floor, room);

                Apartment apartment = Apartment.builder()
                        .apartmentNumber(apartmentNumber)
                        .floor(floor)
                        .status(ApartmentStatus.AVAILABLE)
                        .building(building)
                        .build();

                apartments.add(apartment);
            }
        }

        building.setNumberOfApartments(apartments.size());

        buildingRepository.save(building);
        apartmentRepository.saveAll(apartments);

        return mapToDTO(building);

    }

    @Transactional
    public BuildingDTO removeBuilding(Long buildingId){

        Optional<Building> existingBuildingOpt = buildingRepository.findById(buildingId);

        if (existingBuildingOpt.isEmpty()){
            throw new BuildingIsNotFoundException(buildingId);
        }

        buildingRepository.deleteById(buildingId);

        Building existingBuilding = existingBuildingOpt.get();

        return mapToDTO(existingBuilding);

    }

    public BuildingDTO getById(Long buildingId){

        Optional<Building> existingBuildingOpt = buildingRepository.findById(buildingId);

        if (existingBuildingOpt.isEmpty()){
            throw new BuildingIsNotFoundException(buildingId);
        }

        Building existingBuilding = existingBuildingOpt.get();

        return mapToDTO(existingBuilding);

    }

    public BuildingDTO getByNumber(Integer buildingNumber){

        Optional<Building> existingBuildingOpt = buildingRepository.findByBuildingNumber(buildingNumber);

        if (existingBuildingOpt.isEmpty()){
            throw new BuildingIsNotFoundException(buildingNumber);
        }

        Building existingBuilding = existingBuildingOpt.get();

        return mapToDTO(existingBuilding);

    }


    public List<BuildingDTO> getByAddress(String address){

        String trimmedAddress = address.trim();

        List<Building> buildings = buildingRepository.findByAddressContainingIgnoreCase(address);

        if (buildings.isEmpty()){
            throw new BuildingIsNotFoundException(address);
        }

        return buildings.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private Integer generateRoomNumber(Integer floorNumber, Integer roomNumber){

        return (floorNumber * 100 + roomNumber);

    }

    private BuildingDTO mapToDTO(Building building){

        return BuildingDTO.builder()
                .id(building.getId())
                .buildingNumber(building.getBuildingNumber())
                .address(building.getAddress())
                .numberOfApartments(building.getNumberOfApartments())
                .build();

    }


}

