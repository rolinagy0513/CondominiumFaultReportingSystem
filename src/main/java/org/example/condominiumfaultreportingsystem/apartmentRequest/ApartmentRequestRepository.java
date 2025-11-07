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

    @Query("SELECT r FROM ApartmentRequest r WHERE r.requesterId = :requesterId AND r.status = :status")
    Optional<ApartmentRequest> findByRequesterIdAndStatus(@Param("requesterId") Long requesterId, @Param("status") ApartmentRequestStatus status);

    @EntityGraph(attributePaths = {"apartment.building"})
    @Query("SELECT r FROM ApartmentRequest r WHERE r.status = :requestStatus")
    List<ApartmentRequest> findByStatus(@Param("requestStatus") ApartmentRequestStatus requestStatus);

}
