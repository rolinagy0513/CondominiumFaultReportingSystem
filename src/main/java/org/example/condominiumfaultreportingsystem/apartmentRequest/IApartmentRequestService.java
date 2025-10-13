package org.example.condominiumfaultreportingsystem.apartmentRequest;

import org.example.condominiumfaultreportingsystem.DTO.ApartmentRequestDTO;
import org.example.condominiumfaultreportingsystem.DTO.ApartmentRequestInfoDTO;
import org.example.condominiumfaultreportingsystem.DTO.RequestResponseDTO;

import java.util.List;

public interface IApartmentRequestService {

    ApartmentRequestInfoDTO sendApartmentRequest(ApartmentRequestDTO apartmentRequestDTO);
    void sendApartmentRequestResponse(RequestResponseDTO responseDTO);
    List<ApartmentRequestInfoDTO> getAllPendingRequests();
}
