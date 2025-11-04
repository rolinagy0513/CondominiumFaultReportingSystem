package org.example.condominiumfaultreportingsystem.apartmentRequest;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.ApartmentRequestDTO;
import org.example.condominiumfaultreportingsystem.DTO.ApartmentRequestInfoDTO;
import org.example.condominiumfaultreportingsystem.DTO.RequestResponseDTO;
import org.example.condominiumfaultreportingsystem.apartmentRequest.impl.ApartmentRequestService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/admin/apartmentRequest/response")
    public void sendApartmentRequestResponse(
        @RequestBody RequestResponseDTO responseDTO

    ){
        apartmentRequestService.sendApartmentRequestResponse(responseDTO);
    }

    @GetMapping("/admin/apartmentRequest/getPendingRequests")
    public List<ApartmentRequestInfoDTO> getAllPendingRequests(){
        return apartmentRequestService.getAllPendingRequests();
    }

}
