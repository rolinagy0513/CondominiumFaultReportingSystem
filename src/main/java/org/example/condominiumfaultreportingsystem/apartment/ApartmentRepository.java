package org.example.condominiumfaultreportingsystem.apartment;

import jakarta.persistence.NamedEntityGraphs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ApartmentRepository extends JpaRepository<Apartment,Long> {

    @Query("SELECT a FROM Apartment a WHERE a.id = :apartmentId AND a.building.id = :buildingId")
    Optional<Apartment> findApartment(@Param("apartmentId") Long apartmentId, @Param("buildingId") Long buildingId);

    @EntityGraph(attributePaths = "owner")
    @Query("SELECT a FROM Apartment a WHERE a.building.id = :buildingId")
    Optional<Page<Apartment>> findAllByBuildingId(@Param("buildingId") Long buildingId, Pageable pageable);

    @EntityGraph(attributePaths = {"owner", "building"})
    @Query("SELECT a FROM Apartment a WHERE a.id = :apartmentId")
    Optional<Apartment> findUserAndBuildingWithApartmentId(@Param("apartmentId") Long apartmentId);

    @EntityGraph(attributePaths = "building")
    @Query("SELECT a FROM Apartment a WHERE a.building.id = :buildingId AND a.status = :status")
    Optional<Page<Apartment>> findAllAvailableByBuildingId(@Param("buildingId") Long buildingId, @Param("status") ApartmentStatus status, Pageable pageable);

    @EntityGraph(attributePaths = "building")
    @Query("SELECT a FROM Apartment a WHERE a.id = :apartmentId")
    Optional<Apartment> findByIdWithBuilding(@Param("apartmentId") Long apartmentId);

    @EntityGraph(attributePaths = "owner")
    @Query("SELECT a FROM Apartment a WHERE a.building.id = :buildingId AND a.floor = :floorNumber")
    Optional<Page<Apartment>> findAllByFloorAndBuilding(@Param("buildingId") Long buildingId,
                                                        @Param("floorNumber") Integer floorNumber,
                                                        Pageable pageable);

}
