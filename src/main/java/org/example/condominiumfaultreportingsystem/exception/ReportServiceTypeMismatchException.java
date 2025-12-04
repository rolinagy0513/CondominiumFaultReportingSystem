package org.example.condominiumfaultreportingsystem.exception;

import org.example.condominiumfaultreportingsystem.company.ServiceType;
import org.example.condominiumfaultreportingsystem.report.ReportType;

public class ReportServiceTypeMismatchException extends RuntimeException {
    public ReportServiceTypeMismatchException(ReportType reportType, ServiceType serviceType) {
        super("Service type mismatch: the company handles " + serviceType + " services, but the report is of type " + reportType + ".");

    }
}
