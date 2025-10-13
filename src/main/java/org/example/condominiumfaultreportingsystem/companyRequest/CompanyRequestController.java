package org.example.condominiumfaultreportingsystem.companyRequest;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.CompanyRequestDTO;
import org.example.condominiumfaultreportingsystem.DTO.CompanyRequestInfoDTO;
import org.example.condominiumfaultreportingsystem.DTO.RequestResponseDTO;
import org.example.condominiumfaultreportingsystem.companyRequest.impl.CompanyRequestService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CompanyRequestController {

    private final CompanyRequestService companyRequestService;

    @PostMapping("/companyRequest/send")
    public CompanyRequestInfoDTO sendCompanyRequest(
            @RequestBody CompanyRequestDTO companyRequestDTO
            ){
        return companyRequestService.sendCompanyRequest(companyRequestDTO);
    }

    @PutMapping("/admin/companyRequest/response")
    public void sendCompanyRequestResponse(
            @RequestBody RequestResponseDTO responseDTO
    ){
        companyRequestService.sendCompanyRequestResponse(responseDTO);
    }

    @GetMapping("/admin/companyRequest/getPendingRequests")
    public List<CompanyRequestInfoDTO> getAllPendingRequests(){
        return companyRequestService.getAllPendingRequests();
    }

}
