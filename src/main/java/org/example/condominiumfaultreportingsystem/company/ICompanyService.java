package org.example.condominiumfaultreportingsystem.company;

import org.example.condominiumfaultreportingsystem.DTO.*;
import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface ICompanyService {
    CompanyDTO addCompany(CompanyAddDTO addDTO);
    CompletableFuture<Page<CompanyDTO>> getAllCompanies(Integer page, Integer size, String sortBy, String direction);
    CompanyWithFeedbacksDTO getCompanyById(Long companyId);
    CompanyDTO getMyCompany();
    CompanyDTO editCompanyDetails(EditCompanyDataDTO editCompanyDataDTO);
    CompletableFuture<List<CompanyDTO>> getCompaniesByBuildingId(Long buildingId);
    CompletableFuture<Page<CompanyDTO>> getCompaniesByServiceType(ServiceType serviceType, Integer page, Integer size, String sortBy, String direction);
    CompletableFuture<List<CompanyDTO>> getCompaniesByBuildingIdAndServiceType(Long buildingId, ServiceType serviceType);
    void removeCompany(RemovalDTO removalDTO, Principal principal);

}
