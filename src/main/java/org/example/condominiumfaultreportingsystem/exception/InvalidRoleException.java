package org.example.condominiumfaultreportingsystem.exception;

public class InvalidRoleException extends RuntimeException {
    public InvalidRoleException() {
        super("The user does not have the right role for this operation");
    }
}
