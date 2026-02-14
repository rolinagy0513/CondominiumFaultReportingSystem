package org.example.condominiumfaultreportingsystem.exception;

public class InvalidPriceRangeException extends RuntimeException {
    public InvalidPriceRangeException() {
        super("Invalid data format: The max price is lower than the min price");
    }
}
