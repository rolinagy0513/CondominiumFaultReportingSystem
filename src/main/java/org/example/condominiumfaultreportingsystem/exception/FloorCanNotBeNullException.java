package org.example.condominiumfaultreportingsystem.exception;

public class FloorCanNotBeNullException extends RuntimeException {
    public FloorCanNotBeNullException() {
        super("The newly added building must have at least 1 floor");
    }
}
