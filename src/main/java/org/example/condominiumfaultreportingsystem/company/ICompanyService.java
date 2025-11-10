package org.example.condominiumfaultreportingsystem.company;

import org.example.condominiumfaultreportingsystem.DTO.CompanyDTO;
import org.example.condominiumfaultreportingsystem.DTO.RemovalDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.security.Principal;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface ICompanyService {

    CompletableFuture<Page<CompanyDTO>> getAllCompanies(Integer page, Integer size, String sortBy, String direction);
    CompanyDTO getCompanyById(Long companyId);
    CompletableFuture<List<CompanyDTO>> getCompaniesByBuildingId(Long buildingId);
    CompletableFuture<Page<CompanyDTO>> getCompaniesByServiceType(ServiceType serviceType, Integer page, Integer size, String sortBy, String direction);
    CompletableFuture<List<CompanyDTO>> getCompaniesByBuildingIdAndServiceType(Long buildingId, ServiceType serviceType);
    void removeCompany(RemovalDTO removalDTO, Principal principal);

}
