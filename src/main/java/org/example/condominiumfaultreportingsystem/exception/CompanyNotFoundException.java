package org.example.condominiumfaultreportingsystem.exception;

import org.example.condominiumfaultreportingsystem.company.ServiceType;

public class CompanyNotFoundException extends RuntimeException {
    public CompanyNotFoundException(Long companyId) {
        super("The company has not been found with the id of: " + companyId);
    }

    public CompanyNotFoundException(ServiceType serviceType) {
        super("The company has not been found with the serviceType of: " + serviceType);
    }

    public CompanyNotFoundException(Long buildingId, ServiceType serviceType) {
        super("The company has not been found in the building of: " + buildingId + " and with the service of: " + serviceType);
    }

}
