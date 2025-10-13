package org.example.condominiumfaultreportingsystem.event.apartmentEvents;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequest;

@Getter
@AllArgsConstructor
public class ApartmentRequestAcceptedEvent {

    private final ApartmentRequest apartmentRequest;
    private final Apartment apartment;
    private final GroupDTO group;

}
