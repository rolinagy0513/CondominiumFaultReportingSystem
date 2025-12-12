package org.example.condominiumfaultreportingsystem.exception;

public class CanNotSendFeedbackException extends RuntimeException {
    public CanNotSendFeedbackException(String message) {
        super(message);
    }
}
