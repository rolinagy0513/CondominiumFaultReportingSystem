package org.example.condominiumfaultreportingsystem.exception;

public class UnauthorizedApartmentAccessException extends RuntimeException {
    public UnauthorizedApartmentAccessException() {
        super( "You can only report issues for your own apartment");
    }
}
