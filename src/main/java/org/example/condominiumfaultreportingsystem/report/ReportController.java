package org.example.condominiumfaultreportingsystem.report;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.CompleteReportDTO;
import org.example.condominiumfaultreportingsystem.DTO.ReportDTO;
import org.example.condominiumfaultreportingsystem.DTO.ReportRequestDTO;
import org.example.condominiumfaultreportingsystem.DTO.SubmitReportDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/")
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/resident/report/sendPublic")
    public ReportDTO sendPublicReport(
            @RequestBody ReportRequestDTO reportRequestDTO
            )
    {
        return reportService.sendPublicReport(reportRequestDTO);
    }

    @PostMapping("/resident/report/sendPrivate")
    public ReportDTO sendPrivateReport(
            @RequestParam Long companyId,
            @RequestBody ReportRequestDTO reportRequestDTO
    ){
        return reportService.sendPrivateReport(companyId, reportRequestDTO);
    }

    @PutMapping("/company/report/acceptReport")
    public ReportDTO acceptReport(
            @RequestBody SubmitReportDTO submitReportDTO
    ){
        return reportService.acceptReport(submitReportDTO.getReportId(), submitReportDTO.getCompanyId());
    }

    @PutMapping("/company/report/completeReport")
    public CompleteReportDTO completeReport(
            @RequestParam Long reportId,
            @RequestParam Long companyId,
            @RequestParam Double cost
    ){
        return reportService.completeReport(reportId, companyId, cost);
    }

    @GetMapping("/company/report/getAcceptedReports")
    public CompletableFuture<List<ReportDTO>> getAcceptedReports(
        @RequestParam Long companyId
    ){
        return reportService.getAcceptedReportsForCompany(companyId);
    }

    @GetMapping("/shared/report/getAllPublicSubmitted")
    public CompletableFuture<Page<ReportDTO>> getAllPublicSubmittedReportsInGroup(
            @RequestParam Long groupId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ){
        return reportService.getAllPublicSubmittedReportsInGroup(groupId,page,size,sortBy,direction);
    }

    @GetMapping("/company/report/getAllPrivateSubmitted")
    public CompletableFuture<Page<ReportDTO>> getAllPrivateSubmittedReportsInGroup(
            @RequestParam Long companyId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ){
        return reportService.getAllPrivateSubmittedReportsForCompany(companyId,page,size,sortBy,direction);
    }

    @GetMapping("/shared/report/getById/{reportId}")
    public ReportDTO getReportById(
            @PathVariable Long reportId
    ){
        return reportService.getReportById(reportId);
    }

}
