package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.report.Report;
import org.example.condominiumfaultreportingsystem.report.ReportType;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class NewReportCameEvent {

    private String groupName;
    private String userName;
    private Report report;

}
