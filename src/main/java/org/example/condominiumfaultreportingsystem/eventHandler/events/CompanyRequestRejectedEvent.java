package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.companyRequest.CompanyRequest;

@Getter
@AllArgsConstructor
public class CompanyRequestRejectedEvent {

    private final CompanyRequest companyRequest;

}
