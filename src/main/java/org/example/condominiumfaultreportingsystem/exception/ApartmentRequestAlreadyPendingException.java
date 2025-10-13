package org.example.condominiumfaultreportingsystem.exception;

public class ApartmentRequestAlreadyPendingException extends RuntimeException {
    public ApartmentRequestAlreadyPendingException() {
        super("This apartment is already occupied or is in progress");
    }
}
