package org.example.condominiumfaultreportingsystem.company;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.CompanyDTO;
import org.example.condominiumfaultreportingsystem.company.impl.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping("admin/company/getAll")
    public CompletableFuture<Page<CompanyDTO>> getAllCompanies(

            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction

    ){
        return companyService.getAllCompanies(page, size, sortBy, direction);
    }

    @GetMapping("company/getById/{companyId}")
    public CompanyDTO getCompanyById(
            @PathVariable Long companyId
    ){
        return companyService.getCompanyById(companyId);
    }

    @GetMapping("company/getByBuildingId/{buildingId}")
    public CompletableFuture<List<CompanyDTO>> getCompaniesByBuildingId(
            @PathVariable Long buildingId
    ){
        return companyService.getCompaniesByBuildingId(buildingId);
    }

    @GetMapping("admin/company/getByServiceType")
    public CompletableFuture<Page<CompanyDTO>> getCompaniesByServiceType(

            @RequestParam ServiceType serviceType,

            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction

    ){
        return companyService.getCompaniesByServiceType(serviceType, page, size, sortBy, direction);
    }

    @GetMapping("company/getByBuildingIdAndServiceType")
    public CompletableFuture<List<CompanyDTO>> getCompaniesByBuildingIdAndServiceType(
            @RequestParam Long buildingId,
            @RequestParam ServiceType serviceType
    ){
        return companyService.getCompaniesByBuildingIdAndServiceType(buildingId, serviceType);
    }

    @PutMapping("admin/company/removeCompany/{companyId}")
    public void removeCompany(
            @PathVariable Long companyId
    ){
        companyService.removeCompany(companyId);
    }

}
