package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.report.Report;

@Getter
@AllArgsConstructor
public class ReportCompletedEvent {

    private Long residentId;
    private Report report;

}
