package org.example.condominiumfaultreportingsystem.exception;

public class InvalidResetTokenException extends RuntimeException {
    public InvalidResetTokenException() {
        super("The reset token is invalid or expired");
    }
}
