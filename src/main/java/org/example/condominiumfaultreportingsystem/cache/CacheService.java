package org.example.condominiumfaultreportingsystem.cache;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.ServiceType;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

/**
 * A dedicated service for cache eviction operations.
 * -
 * This service exists due to a limitation in Spring's proxy-based AOP model:
 * {@code @CacheEvict} (and other AOP-based annotations like {@code @Transactional})
 * are only triggered when the annotated method is called from outside the bean,
 * i.e., through the Spring proxy.
 * -
 * If an eviction method is called from within the same class (self-invocation),
 * the annotation will not take effect. To ensure proper cache eviction,
 * these methods are moved to a separate bean, allowing them to be called
 * through the Spring proxy and trigger the eviction as expected.
 */
@Service
@RequiredArgsConstructor
public class CacheService {

    @CacheEvict(value = "buildings", allEntries = true)
    public void evictBuildingsCache(){}

    @CacheEvict(value = "companiesByBuilding", key = "#buildingId")
    public void evictCompanyByBuildingCache(Long buildingId){}

    @CacheEvict(value = "companiesByServiceType", allEntries = true)
    public void evictCompanyByServiceTypeCache(){}

    @CacheEvict(value = "companiesByBuildingIdAndServiceType", key = "{#buildingId, #serviceType}")
    public void evictCompanyByBuildingIdAndServiceTypeCache(Long buildingId, ServiceType serviceType){}

    @CacheEvict(value = "allCompanies", allEntries = true)
    public void evictAllCompaniesCache(){}

    @CacheEvict(value = "apartmentsByBuilding", allEntries = true)
    public void evictAAllApartmentsByBuildingCache(){}

    @CacheEvict(value = "apartmentByFloorAndBuilding", allEntries = true)
    public void evictAllApartmentByFloorAndBuildingCache(){}

    @CacheEvict(value = "availableApartmentsByBuilding", allEntries = true)
    public void evictAvailableApartmentsInBuildingCache(){}

}
