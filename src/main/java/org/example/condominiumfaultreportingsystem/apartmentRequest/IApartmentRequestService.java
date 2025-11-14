package org.example.condominiumfaultreportingsystem.apartmentRequest;

import org.example.condominiumfaultreportingsystem.DTO.ApartmentRequestDTO;
import org.example.condominiumfaultreportingsystem.DTO.ApartmentRequestDetailedInfoDTO;
import org.example.condominiumfaultreportingsystem.DTO.ApartmentRequestInfoDTO;
import org.example.condominiumfaultreportingsystem.DTO.RequestResponseDTO;

import java.security.Principal;
import java.util.List;

public interface IApartmentRequestService {

    ApartmentRequestInfoDTO sendApartmentRequest(ApartmentRequestDTO apartmentRequestDTO, Principal principal);
    void sendApartmentRequestResponse(RequestResponseDTO responseDTO, Principal principal);
    List<ApartmentRequestDetailedInfoDTO> getAllPendingRequests();
}
