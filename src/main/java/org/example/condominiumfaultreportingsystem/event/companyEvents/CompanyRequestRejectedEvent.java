package org.example.condominiumfaultreportingsystem.event.companyEvents;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.companyRequest.CompanyRequest;

@Getter
@AllArgsConstructor
public class CompanyRequestRejectedEvent {

    private final CompanyRequest companyRequest;

}
