package org.example.condominiumfaultreportingsystem.companyRequest;

import org.example.condominiumfaultreportingsystem.DTO.CompanyRequestDTO;
import org.example.condominiumfaultreportingsystem.DTO.CompanyRequestInfoDTO;
import org.example.condominiumfaultreportingsystem.DTO.RequestResponseDTO;

import java.security.Principal;
import java.util.List;

public interface ICompanyRequestService {
    CompanyRequestInfoDTO sendCompanyRequest(CompanyRequestDTO companyRequestDTO, Principal principal);
    void sendCompanyRequestResponse(RequestResponseDTO responseDTO, Principal principal);
    List<CompanyRequestInfoDTO> getAllPendingRequests();
    ActiveCompanyRequest getActiveRequest(Long userId);
}
