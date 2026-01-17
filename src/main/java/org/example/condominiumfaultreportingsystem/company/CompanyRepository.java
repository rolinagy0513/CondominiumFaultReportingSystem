package org.example.condominiumfaultreportingsystem.company;

import org.example.condominiumfaultreportingsystem.building.Building;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    @EntityGraph(attributePaths = "user")
    @Query("SELECT c FROM Company c WHERE c.user.id = :userId")
    Optional<Company> findCompanyWithUser(@Param("userId") Long userId);

    @EntityGraph(attributePaths = "feedbacks")
    @Query("SELECT c FROM Company c WHERE c.id = :companyId")
    Optional<Company> findCompanyWithFeedbacks(@Param("companyId") Long companyId);

    @EntityGraph(attributePaths = "user")
    @Query("SELECT c FROM Company c WHERE c.id = :companyId")
    Optional<Company> findUserWithCompany(@Param("companyId") Long companyId);

    @Query("SELECT DISTINCT c FROM Company c JOIN c.buildings b WHERE b.id = :buildingId")
    Optional<List<Company>> getCompaniesByBuildingId(@Param("buildingId") Long buildingId);

    @Query("SELECT c FROM Company c WHERE c.serviceType = :serviceType")
    Optional<Page<Company>> getCompaniesByServiceType(@Param("serviceType") ServiceType serviceType, Pageable pageable);

    @Query("SELECT DISTINCT c FROM Company c JOIN c.buildings b WHERE b.id = :buildingId AND c.serviceType = :serviceType")
    Optional<List<Company>> getCompaniesByBuildingIdAndServiceType(@Param("buildingId") Long buildingId, @Param("serviceType") ServiceType serviceType);

    @EntityGraph(attributePaths = "buildings")
    @Query("SELECT c FROM Company c WHERE c.id = :companyId")
    Optional<Company> getCompanyWithBuildings(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.company.id = :companyId")
    Integer countFeedbacksByCompanyId(@Param("companyId") Long companyId);



}
