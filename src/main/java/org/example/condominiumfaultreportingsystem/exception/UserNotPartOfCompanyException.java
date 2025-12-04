package org.example.condominiumfaultreportingsystem.exception;

public class UserNotPartOfCompanyException extends RuntimeException {
    public UserNotPartOfCompanyException() {
        super("The user is not the owner of the company");
    }
}
