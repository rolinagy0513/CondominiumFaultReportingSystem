package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.group.Group;

import java.util.List;

@Getter
@AllArgsConstructor
public class CompanyRemovedEvent {

    private final Company company;
    private final Long userId;
    private final List<Group> groups;

}
