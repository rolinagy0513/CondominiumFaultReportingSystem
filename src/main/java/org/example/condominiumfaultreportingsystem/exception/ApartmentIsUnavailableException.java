package org.example.condominiumfaultreportingsystem.exception;

public class ApartmentIsUnavailableException extends RuntimeException {
    public ApartmentIsUnavailableException() {
        super("The requested apartment is currently not available");
    }
}
