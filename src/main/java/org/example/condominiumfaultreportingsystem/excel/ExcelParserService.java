package org.example.condominiumfaultreportingsystem.excel;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.example.condominiumfaultreportingsystem.exception.InvalidRoleException;
import org.example.condominiumfaultreportingsystem.security.user.Role;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExcelParserService {

    public List<ExcelUploadDTO> parseExcelFile(MultipartFile file) throws IOException {

        List<ExcelUploadDTO> uploadData = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            int rowNumber = 1;

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                try {
                    ExcelUploadDTO dto = ExcelUploadDTO.builder()
                            .firstname(getCellValueAsString(row.getCell(0)))
                            .lastname(getCellValueAsString(row.getCell(1)))
                            .email(getCellValueAsString(row.getCell(2)))
                            .password(getCellValueAsString(row.getCell(3)))
                            .buildingNumber(getCellValueAsInteger(row.getCell(5)))
                            .buildingAddress(getCellValueAsString(row.getCell(6)))
                            .floor(getCellValueAsInteger(row.getCell(7)))
                            .apartmentNumber(getCellValueAsInteger(row.getCell(8)))
                            .rowNumber(rowNumber++)
                            .build();

                    uploadData.add(dto);

                } catch (Exception e) {
                    log.error("Error parsing row {}: {}", rowNumber, e.getMessage());
                }
            }
        }

        return uploadData;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;

        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> null;
        };
    }

    private Integer getCellValueAsInteger(Cell cell) {
        if (cell == null) return null;

        return switch (cell.getCellType()) {
            case NUMERIC -> (int) cell.getNumericCellValue();
            case STRING -> {
                try {
                    yield Integer.parseInt(cell.getStringCellValue().trim());
                } catch (NumberFormatException e) {
                    yield null;
                }
            }
            default -> null;
        };
    }

}
