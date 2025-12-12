package org.example.condominiumfaultreportingsystem.report;

import org.example.condominiumfaultreportingsystem.security.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {

    @EntityGraph(attributePaths = {"group", "user"})
    @Query("SELECT r FROM Report r WHERE r.reportPrivacy = :reportPrivacy AND r.reportStatus = :reportStatus AND r.group.id = :groupId")
    Optional<Page<Report>> getAllSubmittedPublicReportsInGroup(
            @Param("reportPrivacy") ReportPrivacy reportPrivacy,
            @Param("reportStatus") ReportStatus reportStatus,
            @Param("groupId") Long groupId, Pageable pageable
    );

    @EntityGraph(attributePaths = "user")
    @Query("SELECT r FROM Report r WHERE r.reportPrivacy = :reportPrivacy AND r.reportStatus = :reportStatus AND r.companyId = :companyId")
    Optional<Page<Report>> getAllSubmittedPrivateReportsForCompany(
            @Param("reportPrivacy") ReportPrivacy reportPrivacy,
            @Param("reportStatus") ReportStatus reportStatus,
            @Param("companyId") Long companyId, Pageable pageable
    );

    @Query("SELECT r FROM Report r WHERE r.companyId = :companyId AND r.reportStatus = :status")
    Optional<List<Report>> getAllAcceptedReportsForCompany(@Param("companyId") Long companyId, @Param("status") ReportStatus status);

    @EntityGraph(attributePaths = "user")
    @Query("SELECT r FROM Report r WHERE r.id = :reportId")
    Optional<Report> getReportByIdWithUser(@Param("reportId") Long reportId);

    Long user(User user);
}
