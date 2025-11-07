package org.example.condominiumfaultreportingsystem.companyRequest;

import jakarta.persistence.OneToOne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CompanyRequestRepository extends JpaRepository<CompanyRequest, Long> {

    @Query("SELECT c FROM CompanyRequest c WHERE c.requesterId = :userId AND c.status = :status")
    Optional<CompanyRequest> existsForUserWithStatus(@Param("userId") Long userId, @Param("status") CompanyRequestStatus status);

    @Query("SELECT r FROM CompanyRequest r WHERE r.status = :companyRequestStatus")
    List<CompanyRequest> findByStatus(@Param("companyRequestStatus") CompanyRequestStatus companyRequestStatus);

    @Query("SELECT r FROM CompanyRequest r WHERE r.requesterId = :requesterId AND r.status = :status")
    Optional<CompanyRequest> findByRequesterIdAndStatus(@Param("requesterId") Long requesterId, @Param("status") CompanyRequestStatus status);

}
