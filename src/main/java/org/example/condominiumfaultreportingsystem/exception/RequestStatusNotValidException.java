package org.example.condominiumfaultreportingsystem.exception;

public class RequestStatusNotValidException extends RuntimeException {
    public RequestStatusNotValidException(String message) {
        super(message);
    }
}
