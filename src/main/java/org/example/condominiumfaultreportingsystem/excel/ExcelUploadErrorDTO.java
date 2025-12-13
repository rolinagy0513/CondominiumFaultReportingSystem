package org.example.condominiumfaultreportingsystem.excel;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExcelUploadErrorDTO {
    private Integer rowNumber;
    private String email;
    private String errorMessage;
    private ErrorType errorType;
}
