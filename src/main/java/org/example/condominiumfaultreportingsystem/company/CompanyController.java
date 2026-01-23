package org.example.condominiumfaultreportingsystem.company;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.*;
import org.example.condominiumfaultreportingsystem.company.impl.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/")
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping("/admin/company/addCompany")
    public CompanyDTO addCompany(
            @RequestBody CompanyAddDTO addDTO
            )
    {
        return companyService.addCompany(addDTO);
    }

    @GetMapping("/admin/company/getAll")
    public CompletableFuture<Page<CompanyDTO>> getAllCompanies(

            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction

    ){
        return companyService.getAllCompanies(page, size, sortBy, direction);
    }

    @GetMapping("/resident/company/getById/{companyId}")
    public CompanyWithFeedbacksDTO getCompanyById(
            @PathVariable Long companyId
    ){
        return companyService.getCompanyById(companyId);
    }

    @GetMapping("/company/company/getMyCompany")
    public CompanyDTO getMyCompany(){
        return companyService.getMyCompany();
    }

    @PutMapping("/company/company/editCompany")
    public CompanyDTO editCompany(
            @RequestBody EditCompanyDataDTO editCompanyDataDTO
    ){
        return companyService.editCompanyDetails(editCompanyDataDTO);
    }

    @GetMapping("/resident/company/getByBuildingId/{buildingId}")
    public CompletableFuture<List<CompanyDTO>> getCompaniesByBuildingId(
            @PathVariable Long buildingId
    ){
        return companyService.getCompaniesByBuildingId(buildingId);
    }

    @GetMapping("/admin/company/getByServiceType")
    public CompletableFuture<Page<CompanyDTO>> getCompaniesByServiceType(

            @RequestParam ServiceType serviceType,

            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction

    ){
        return companyService.getCompaniesByServiceType(serviceType, page, size, sortBy, direction);
    }

    @GetMapping("/resident/company/getByBuildingIdAndServiceType/{buildingId}")
    public CompletableFuture<List<CompanyDTO>> getCompaniesByBuildingIdAndServiceType(
            @PathVariable Long buildingId,
            @RequestParam ServiceType serviceType
    ){
        return companyService.getCompaniesByBuildingIdAndServiceType(buildingId, serviceType);
    }

    @MessageMapping("/admin/company/removeCompany")
    public void removeCompany(
            @Payload RemovalDTO removalDTO,
            Principal principal
            ){
        companyService.removeCompany(removalDTO, principal);
    }

}
