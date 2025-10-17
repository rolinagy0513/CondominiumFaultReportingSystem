package org.example.condominiumfaultreportingsystem.exception;

public class ApartmentNotFoundInBuildingException extends RuntimeException {
    public ApartmentNotFoundInBuildingException(Long buildingId) {
        super("The apartments are not found in the building with the id of: " + buildingId);
    }

    public ApartmentNotFoundInBuildingException(Long buildingId,Integer floorNumber) {
        super("The apartment is not found in the building with the id of: " + buildingId + " and in the floor of: " + floorNumber);
    }
}
