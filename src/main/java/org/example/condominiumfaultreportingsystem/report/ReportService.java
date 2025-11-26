package org.example.condominiumfaultreportingsystem.report;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.ReportDTO;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    //Add a report(Private or Public) - RESIDENT
    //Send a report response - COMPANY
    //Get all public reports - both
    //Get all private reports - COMPANY
    //Get a report by id
    //Remove report

    private final ReportRepository reportRepository;

//    public ReportDTO sendReport(ReportDecisionStatus reportDecisionStatus){
//
//
//
//    }

}
