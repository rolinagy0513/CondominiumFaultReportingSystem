package org.example.condominiumfaultreportingsystem.exception;

public class InvalidInputsException extends RuntimeException {
    public InvalidInputsException() {
        super("The inputs can not be null");
    }
}
