package org.example.condominiumfaultreportingsystem.companyRequest;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.CompanyRequestDTO;
import org.example.condominiumfaultreportingsystem.DTO.CompanyRequestInfoDTO;
import org.example.condominiumfaultreportingsystem.DTO.RequestResponseDTO;
import org.example.condominiumfaultreportingsystem.companyRequest.impl.CompanyRequestService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CompanyRequestController {

    private final CompanyRequestService companyRequestService;

    @MessageMapping("/companyRequest/send")
    public CompanyRequestInfoDTO sendCompanyRequest(
            @Payload CompanyRequestDTO companyRequestDTO,
            Principal principal
            ){
        return companyRequestService.sendCompanyRequest(companyRequestDTO, principal);
    }

    @MessageMapping("/admin/companyRequest/response")
    public void sendCompanyRequestResponse(
            @Payload RequestResponseDTO responseDTO,
                    Principal principal
    ){
        companyRequestService.sendCompanyRequestResponse(responseDTO, principal);
    }

    @GetMapping("/admin/companyRequest/getPendingRequests")
    public List<CompanyRequestInfoDTO> getAllPendingRequests(){
        return companyRequestService.getAllPendingRequests();
    }

}
