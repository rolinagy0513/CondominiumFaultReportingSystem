package org.example.condominiumfaultreportingsystem.company.priceRange;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceRange {

    private BigDecimal maxPrice;
    private BigDecimal minPrice;

    @Enumerated(EnumType.STRING)
    private CurrencyType currencyType;

}
