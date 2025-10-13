package org.example.condominiumfaultreportingsystem.exception;

public class CompanyNotFoundInBuildingException extends RuntimeException {
    public CompanyNotFoundInBuildingException(Long buildingId) {
        super("There are no companies in teh building wih the id of: " + buildingId);
    }
}
