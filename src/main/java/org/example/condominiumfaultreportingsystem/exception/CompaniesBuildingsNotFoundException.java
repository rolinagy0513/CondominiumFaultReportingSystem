package org.example.condominiumfaultreportingsystem.exception;

public class CompaniesBuildingsNotFoundException extends RuntimeException {
    public CompaniesBuildingsNotFoundException(Long companyId) {
        super("The buildings were not found with the company id of: " + companyId);
    }
}
