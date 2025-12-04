package org.example.condominiumfaultreportingsystem.exception;

public class ReportAlreadyAcceptedException extends RuntimeException {
    public ReportAlreadyAcceptedException() {
        super("This report has already been accepted by another company");
    }
}
