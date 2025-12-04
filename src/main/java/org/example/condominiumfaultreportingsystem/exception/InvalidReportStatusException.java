package org.example.condominiumfaultreportingsystem.exception;

import org.example.condominiumfaultreportingsystem.report.ReportStatus;

public class InvalidReportStatusException extends RuntimeException {
    public InvalidReportStatusException(ReportStatus reportStatus) {
        super("The report needs to have a status of: " + reportStatus);
    }
}
