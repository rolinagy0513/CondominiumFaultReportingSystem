package org.example.condominiumfaultreportingsystem.apartmentRequest;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApartmentRequestRepository extends JpaRepository<ApartmentRequest, Long> {

    @EntityGraph(attributePaths = {"apartment.building"})
    Optional<ApartmentRequest> findWithApartmentById(Long id);

    @EntityGraph(attributePaths = {"apartment.building"})
    @Query("SELECT r FROM ApartmentRequest r WHERE r.status = :requestStatus")
    List<ApartmentRequest> findByStatus(@Param("requestStatus") ApartmentRequestStatus requestStatus);

}
