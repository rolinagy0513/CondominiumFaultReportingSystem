package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;
import org.example.condominiumfaultreportingsystem.companyRequest.CompanyRequest;

@Getter
@AllArgsConstructor
public class CompanyRequestAcceptedEvent {

    private final CompanyRequest companyRequest;
    private final GroupDTO group;

}
