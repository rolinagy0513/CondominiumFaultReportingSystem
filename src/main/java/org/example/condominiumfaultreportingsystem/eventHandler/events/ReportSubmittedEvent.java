package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.report.Report;

@Getter
@AllArgsConstructor
public class ReportSubmittedEvent {

    private Long residentId;
    private Company company;
    private Report report;

}
