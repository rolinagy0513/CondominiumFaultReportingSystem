package org.example.condominiumfaultreportingsystem.exception;

public class RequestNotFoundException extends RuntimeException {
    public RequestNotFoundException(Long requestId) {
        super("The request has been not found with the id of: " + requestId);
    }
}
