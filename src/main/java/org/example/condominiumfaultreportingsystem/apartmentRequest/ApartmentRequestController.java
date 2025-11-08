package org.example.condominiumfaultreportingsystem.apartmentRequest;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.ApartmentRequestDTO;
import org.example.condominiumfaultreportingsystem.DTO.ApartmentRequestDetailedInfoDTO;
import org.example.condominiumfaultreportingsystem.DTO.ApartmentRequestInfoDTO;
import org.example.condominiumfaultreportingsystem.DTO.RequestResponseDTO;
import org.example.condominiumfaultreportingsystem.apartmentRequest.impl.ApartmentRequestService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@Controller
@RequiredArgsConstructor
@RequestMapping("api/")
public class ApartmentRequestController {

    private final ApartmentRequestService apartmentRequestService;

    @PostMapping("/apartmentRequest/send")
    public ApartmentRequestInfoDTO sendApartmentRequest(
            @RequestBody ApartmentRequestDTO apartmentRequestDTO
    ){
        return apartmentRequestService.sendApartmentRequest(apartmentRequestDTO);
    }

    @MessageMapping("/admin/apartmentRequest/response")
    public void sendApartmentRequestResponse(
        @Payload RequestResponseDTO responseDTO,
        Principal principal

    ){
        apartmentRequestService.sendApartmentRequestResponse(responseDTO, principal);
    }

    @GetMapping("/admin/apartmentRequest/getPendingRequests")
    public List<ApartmentRequestDetailedInfoDTO> getAllPendingRequests(){
        return apartmentRequestService.getAllPendingRequests();
    }

}
