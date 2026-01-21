package org.example.condominiumfaultreportingsystem.report;

import org.example.condominiumfaultreportingsystem.DTO.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IReportService {

    ReportDTO sendPublicReport(ReportRequestDTO reportRequestDTO);
    ReportDTO sendPrivateReport(Long companyId, ReportRequestDTO reportRequestDTO);
    ReportDTO acceptReport(Long reportId, Long companyId);
    CompleteReportDTO completeReport(Long reportId, Long companyId, Double cost);
    List<ReportDTO> getAcceptedReportsForCompany(Long companyId);
    CompletableFuture<Page<ReportDTO>> getAllPublicSubmittedReportsInGroup(Long groupId, Integer page, Integer size, String sortBy, String direction);
    CompletableFuture<Page<ReportDTO>> getAllPrivateSubmittedReportsForCompany(Long companyId, Integer page, Integer size, String sortBy, String direction);
    List<ReportWithCompanyDTO> getInProgressReport();
    List<CompletedReportDataDTO> getCompletedReportsForUser();
    ReportDTO getReportById(Long reportId);

}
