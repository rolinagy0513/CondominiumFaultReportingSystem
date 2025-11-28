package org.example.condominiumfaultreportingsystem.report;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {

    @EntityGraph(attributePaths = {"group", "user"})
    @Query("SELECT r FROM Report r WHERE r.reportPrivacy = :reportPrivacy AND r.reportStatus = :reportStatus AND r.group.id = :groupId")
    Optional<Page<Report>> getAllSubmittedPublicReportsInGroup(
            @Param("reportPrivacy") ReportPrivacy reportPrivacy,
            @Param("reportStatus") ReportStatus reportStatus,
            @Param("groupId") Long groupId, Pageable pageable
    );

}
