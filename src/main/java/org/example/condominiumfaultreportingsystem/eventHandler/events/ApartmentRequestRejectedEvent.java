package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequest;

@Getter
@AllArgsConstructor
public class ApartmentRequestRejectedEvent {

    private final ApartmentRequest apartmentRequest;
    private final Apartment apartment;

}
