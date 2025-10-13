package org.example.condominiumfaultreportingsystem.company;

import org.example.condominiumfaultreportingsystem.security.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    @EntityGraph(attributePaths = "user")
    @Query("SELECT c FROM Company c WHERE c.user.id = :userId")
    Optional<Company> findCompanyWithUser(@Param("userId") Long userId);

    @Query("SELECT DISTINCT c FROM Company c JOIN c.buildings b WHERE b.id = :buildingId")
    Optional<List<Company>> getCompaniesByBuildingId(@Param("buildingId") Long buildingId);

    @Query("SELECT c FROM Company c WHERE c.serviceType = :serviceType")
    Optional<Page<Company>> getCompaniesByServiceType(@Param("serviceType") ServiceType serviceType, Pageable pageable);

    @Query("SELECT DISTINCT c FROM Company c JOIN c.buildings b WHERE b.id = :buildingId AND c.serviceType = :serviceType")
    Optional<List<Company>> getCompaniesByBuildingIdAndServiceType(@Param("buildingId") Long buildingId, @Param("serviceType") ServiceType serviceType);

}
