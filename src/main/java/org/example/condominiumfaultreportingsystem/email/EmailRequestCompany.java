package org.example.condominiumfaultreportingsystem.email;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequestCompany {
    private String to;
    private String name;
    private String buildingAddress;
}
