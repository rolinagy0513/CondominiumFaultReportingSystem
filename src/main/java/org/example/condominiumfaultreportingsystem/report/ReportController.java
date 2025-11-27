package org.example.condominiumfaultreportingsystem.report;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.ReportDTO;
import org.example.condominiumfaultreportingsystem.DTO.ReportRequestDTO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/")
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/resident/report/send")
    public ReportDTO sendReport
            (
            @RequestBody ReportRequestDTO reportRequestDTO
            )
    {
        return reportService.sendPublicReport(reportRequestDTO);
    }

    @GetMapping("/shared/report/getAllPendingSubmitted")
    public CompletableFuture<List<ReportDTO>> getAllPublicSubmittedReportsInGroup(
            @RequestParam Long groupId
    ){
        return reportService.getAllPublicSubmittedReportsInGroup(groupId);
    }

}
