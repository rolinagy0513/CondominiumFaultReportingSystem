package org.example.condominiumfaultreportingsystem.exception;

public class BuildingIsPresentException extends RuntimeException {
    public BuildingIsPresentException(Integer buildingNumber) {
        super("The building is already present in the system with the number of" + buildingNumber);
    }
}
