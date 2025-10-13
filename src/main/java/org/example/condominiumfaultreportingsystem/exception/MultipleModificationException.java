package org.example.condominiumfaultreportingsystem.exception;

public class MultipleModificationException extends RuntimeException {
    public MultipleModificationException() {
        super("The resource was modified by another person");
    }
}
