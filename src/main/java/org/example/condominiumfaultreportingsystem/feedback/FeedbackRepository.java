package org.example.condominiumfaultreportingsystem.feedback;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    @Query("SELECT f FROM Feedback f WHERE f.report.id = :reportId")
    Optional<Feedback> getFeedbackByReportId(@Param("reportId") Long reportId);

}
