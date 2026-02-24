package org.example.condominiumfaultreportingsystem.exception;

public class EmailLimitReachedException extends RuntimeException {
    public EmailLimitReachedException() {
        super("Daily email limit reached.");
    }
}
