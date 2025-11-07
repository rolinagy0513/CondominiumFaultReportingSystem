package org.example.condominiumfaultreportingsystem.exception;

public class UserAlreadyHasRequestException extends RuntimeException {
    public UserAlreadyHasRequestException(String message) {
        super(message);
    }
}
