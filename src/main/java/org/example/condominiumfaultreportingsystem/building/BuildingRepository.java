package org.example.condominiumfaultreportingsystem.building;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BuildingRepository extends JpaRepository<Building, Long> {

    Optional<Building> findByBuildingNumber(Integer buildingNumber);
    List<Building> findByAddressContainingIgnoreCase(String address);

    @Query("SELECT b FROM Building b JOIN b.apartments a WHERE a.id = :apartmentId")
    Optional<Building> findBuildingByApartmentId(@Param("apartmentId") Long apartmentId);

}
