package org.example.condominiumfaultreportingsystem.exception;

public class ExistingPendingRequestException extends RuntimeException {
    public ExistingPendingRequestException(Long userId) {
        super("The user already has a pending request with the id of: " + userId);
    }

    public ExistingPendingRequestException() {
        super("User already has a pending request");
    }
}
