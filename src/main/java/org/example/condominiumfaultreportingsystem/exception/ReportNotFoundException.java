package org.example.condominiumfaultreportingsystem.exception;

public class ReportNotFoundException extends RuntimeException {
    public ReportNotFoundException() {
        super("No available reports has been found");
    }
}
