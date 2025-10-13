package org.example.condominiumfaultreportingsystem.exception;

public class BuildingIsNotFoundException extends RuntimeException {
    public BuildingIsNotFoundException(Long buildingId) {
        super("The building is not present with the id of: " + buildingId);
    }

    public BuildingIsNotFoundException(Integer buildingNum) {
        super("The building is not present with the id of: " + buildingNum);
    }

    public BuildingIsNotFoundException(String buildingAddress) {
        super("The building is not present with the address of: " + buildingAddress);
    }
}
