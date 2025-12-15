package org.example.condominiumfaultreportingsystem.excel;

import lombok.Builder;
import lombok.Data;
import org.example.condominiumfaultreportingsystem.DTO.UserDTO;

import java.util.List;

@Data
@Builder
public class ExcelUploadResultDTO {

    private Integer totalRows;
    private Integer successfulRegistrations;
    private Integer failedRegistrations;
    private List<ExcelUploadErrorDTO> errors;
    private List<UserDTO> createdUsers;


}
