package org.example.condominiumfaultreportingsystem.exception;

public class InvalidRequestStatusException extends RuntimeException {
    public InvalidRequestStatusException() {
        super("Some issue happened with the request processing.");
    }
}
