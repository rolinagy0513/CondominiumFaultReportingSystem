package org.example.condominiumfaultreportingsystem.exception;

public class ApartmentNotFoundException extends RuntimeException {
    public ApartmentNotFoundException(Long apartmentId) {
        super("The apartment is not found in this building with the id of: " + apartmentId);
    }

    public ApartmentNotFoundException(Integer apartmentNumber) {
        super("The apartment is not found with the room number of: " + apartmentNumber);
    }
}
