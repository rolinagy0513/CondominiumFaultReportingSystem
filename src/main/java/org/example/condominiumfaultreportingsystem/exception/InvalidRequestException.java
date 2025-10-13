package org.example.condominiumfaultreportingsystem.exception;

import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequestStatus;
import org.example.condominiumfaultreportingsystem.companyRequest.CompanyRequestStatus;

public class InvalidRequestException extends RuntimeException {

    public InvalidRequestException(ApartmentRequestStatus status) {
        super("Can not edit a request that has a status of: " + status);
    }

    public InvalidRequestException(CompanyRequestStatus status) {
        super("Can not edit a request that has a status of: " + status);
    }
}
