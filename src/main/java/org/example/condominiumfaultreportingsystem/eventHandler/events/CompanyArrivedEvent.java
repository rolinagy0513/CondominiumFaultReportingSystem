package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.group.Group;

@Getter
@AllArgsConstructor
public class CompanyArrivedEvent {

    private final Company company;
    private final GroupDTO group;

}
