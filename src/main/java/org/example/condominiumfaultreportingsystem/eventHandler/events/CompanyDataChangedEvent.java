package org.example.condominiumfaultreportingsystem.eventHandler.events;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompanyDataChangedEvent {

    private final String groupIdentifier;
}
