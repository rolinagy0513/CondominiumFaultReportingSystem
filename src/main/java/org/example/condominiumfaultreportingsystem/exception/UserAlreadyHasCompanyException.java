package org.example.condominiumfaultreportingsystem.exception;

public class UserAlreadyHasCompanyException extends RuntimeException {
    public UserAlreadyHasCompanyException(Long userId) {
        super("The user with the id of: " + userId + " already has a company registered.");
    }
}
