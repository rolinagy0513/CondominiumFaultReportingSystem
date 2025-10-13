package org.example.condominiumfaultreportingsystem.apartment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ApartmentRepository extends JpaRepository<Apartment,Long> {

    @Query("SELECT a FROM Apartment a WHERE a.id = :apartmentId AND a.building.id = :buildingId")
    Optional<Apartment> findApartment(@Param("apartmentId") Long apartmentId, @Param("buildingId") Long buildingId);

}
