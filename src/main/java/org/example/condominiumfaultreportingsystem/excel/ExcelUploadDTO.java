package org.example.condominiumfaultreportingsystem.excel;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExcelUploadDTO {

    private String firstname;
    private String lastname;
    private String email;
    private String password;

    private Integer buildingNumber;
    private String buildingAddress;
    private Integer floor;
    private Integer apartmentNumber;

    private Integer rowNumber;

}
