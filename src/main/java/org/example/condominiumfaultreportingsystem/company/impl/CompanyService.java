package org.example.condominiumfaultreportingsystem.company.impl;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.CompanyDTO;
import org.example.condominiumfaultreportingsystem.DTO.RemovalDTO;
import org.example.condominiumfaultreportingsystem.DTO.UserWithRoleDTO;
import org.example.condominiumfaultreportingsystem.building.Building;
import org.example.condominiumfaultreportingsystem.building.BuildingRepository;
import org.example.condominiumfaultreportingsystem.cache.CacheService;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.company.CompanyRepository;
import org.example.condominiumfaultreportingsystem.company.ICompanyService;
import org.example.condominiumfaultreportingsystem.company.ServiceType;
import org.example.condominiumfaultreportingsystem.eventHandler.events.CompanyRemovedEvent;
import org.example.condominiumfaultreportingsystem.exception.CompanyNotFoundException;
import org.example.condominiumfaultreportingsystem.exception.CompanyNotFoundInBuildingException;
import org.example.condominiumfaultreportingsystem.exception.InvalidRoleException;
import org.example.condominiumfaultreportingsystem.group.impl.GroupService;
import org.example.condominiumfaultreportingsystem.security.user.Role;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.example.condominiumfaultreportingsystem.security.user.UserRepository;
import org.example.condominiumfaultreportingsystem.security.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class CompanyService implements ICompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final BuildingRepository buildingRepository;

    private final UserService userService;
    private final GroupService groupService;
    private final CacheService cacheService;

    @Async("asyncExecutor")
    @Cacheable(value = "allCompanies")
    public CompletableFuture<Page<CompanyDTO>> getAllCompanies(
            Integer page,
            Integer size,
            String sortBy,
            String direction
    ) {

        Sort sort;

        if (direction.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Company> companiesPage = companyRepository.findAll(pageable);

        Page<CompanyDTO> dtoPage = companiesPage.map(this::mapToDto);
        return CompletableFuture.completedFuture(dtoPage);
    }

    public CompanyDTO getCompanyById(Long companyId){

        Company company = companyRepository.findById(companyId)
                .orElseThrow(()-> new CompanyNotFoundException(companyId));

        return mapToDto(company);
    }

    @Async("asyncExecutor")
    @Cacheable(value = "companiesByBuilding", key = "#buildingId")
    public CompletableFuture<List<CompanyDTO>> getCompaniesByBuildingId(Long buildingId){

        Optional<List<Company>> companiesOpt = companyRepository.getCompaniesByBuildingId(buildingId);

        if (companiesOpt.isEmpty()){
            throw new CompanyNotFoundInBuildingException(buildingId);
        }

        List<Company> companies = companiesOpt.get();

        return CompletableFuture.completedFuture(companies.stream().map(this::mapToDto).toList());

    }

    @Async("asyncExecutor")
    @Cacheable(value = "companiesByServiceType")
    public CompletableFuture<Page<CompanyDTO>> getCompaniesByServiceType(
            ServiceType serviceType,
            Integer page,
            Integer size,
            String sortBy,
            String direction
    ){

        Sort sort;

        if (direction.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Optional<Page<Company>> companiesOpt = companyRepository.getCompaniesByServiceType(serviceType,pageable);

        if (companiesOpt.isEmpty()){
            throw new CompanyNotFoundException(serviceType);
        }

        Page<Company> companiesPage = companiesOpt.get();

        Page<CompanyDTO> dtoPage = companiesPage.map(this::mapToDto);
        return CompletableFuture.completedFuture(dtoPage);

    }

    @Async("asyncExecutor")
    @Cacheable(value = "companiesByBuildingIdAndServiceType", key = "{#buildingId, #serviceType}")
    public CompletableFuture<List<CompanyDTO>> getCompaniesByBuildingIdAndServiceType(Long buildingId, ServiceType serviceType){

        Optional<List<Company>> companiesOpt = companyRepository.getCompaniesByBuildingIdAndServiceType(buildingId,serviceType);

        if (companiesOpt.isEmpty()){
            throw new CompanyNotFoundException(buildingId,serviceType);
        }

        List<Company> companies = companiesOpt.get();

        return CompletableFuture.completedFuture(companies.stream().map(this::mapToDto).toList());

    }

    @Transactional
    public void removeCompany(RemovalDTO removalDTO, Principal principal){

        Long companyId = removalDTO.getTargetId();

        User user = userService.getUserFromPrincipal(principal);

        UserWithRoleDTO currentAdmin = UserWithRoleDTO.builder()
                .id(user.getId())
                .userName(user.getEmail())
                .role(user.getRole())
                .build();

        if (currentAdmin.getRole() != Role.ADMIN){
            throw new InvalidRoleException();
        }

        Company companyToRemove = companyRepository.getCompanyWithBuildings(companyId)
                .orElseThrow(() -> new CompanyNotFoundException(companyId));

        User userToUpdate = companyToRemove.getUser();

        if (companyToRemove.getBuildings() != null && !companyToRemove.getBuildings().isEmpty()) {

            List<Building> buildings = new ArrayList<>(companyToRemove.getBuildings());

            for (Building building : buildings) {

                if (building.getCompanies() != null) {
                    building.getCompanies().remove(companyToRemove);
                }

                companyToRemove.getBuildings().remove(building);

                cacheService.evictCompanyByBuildingCache(building.getId());
                cacheService.evictCompanyByBuildingIdAndServiceTypeCache(building.getId(), companyToRemove.getServiceType());

            }

            buildingRepository.saveAll(buildings);
        }

        if (userToUpdate != null) {
            userToUpdate.setCompany(null);
            userRepository.save(userToUpdate);

            groupService.removeUserFromAllGroups(userToUpdate.getId(), companyToRemove);
            userService.demoteCompanyToUser(currentAdmin.getId(), userToUpdate.getId());

        }

        companyToRemove.setUser(null);
        companyRepository.delete(companyToRemove);

        cacheService.evictAllCompaniesCache();
        cacheService.evictCompanyByServiceTypeCache();

    }

    private CompanyDTO mapToDto(Company company){

        return CompanyDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .email(company.getEmail())
                .phoneNumber(company.getPhoneNumber())
                .address(company.getAddress())
                .serviceType(company.getServiceType())
                .build();

    }

}
