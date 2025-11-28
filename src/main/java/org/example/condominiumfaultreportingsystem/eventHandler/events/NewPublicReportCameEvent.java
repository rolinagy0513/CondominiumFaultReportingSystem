package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.report.Report;

@Getter
@AllArgsConstructor
public class NewPublicReportCameEvent {

    private String groupName;
    private String userName;
    private Report report;

}
