package org.example.condominiumfaultreportingsystem.exception;

public class InvalidTempTokenException extends RuntimeException {
    public InvalidTempTokenException() {
        super("The temporary token is expired or invalid");
    }
}
