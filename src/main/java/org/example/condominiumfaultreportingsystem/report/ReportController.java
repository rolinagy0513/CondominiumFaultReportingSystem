package org.example.condominiumfaultreportingsystem.report;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.ReportDTO;
import org.example.condominiumfaultreportingsystem.DTO.ReportRequestDTO;
import org.springframework.data.domain.Page;
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
    public CompletableFuture<Page<ReportDTO>> getAllPublicSubmittedReportsInGroup(
            @RequestParam Long groupId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ){
        return reportService.getAllPublicSubmittedReportsInGroup(groupId,page,size,sortBy,direction);
    }

}
