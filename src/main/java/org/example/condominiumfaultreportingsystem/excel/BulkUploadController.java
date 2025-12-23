package org.example.condominiumfaultreportingsystem.excel;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/bulk-upload")
@RequiredArgsConstructor
public class BulkUploadController {

    private final BulkUserRegistrationService bulkUserRegistrationService;

    @PostMapping(value = "/users", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ExcelUploadResultDTO> uploadUsersFromExcel(
            @RequestParam("file") MultipartFile file) {

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            String filename = file.getOriginalFilename();
            if (filename == null || (!filename.endsWith(".xlsx") && !filename.endsWith(".xls"))) {
                return ResponseEntity.badRequest().body(
                        ExcelUploadResultDTO.builder()
                                .totalRows(0)
                                .errors(List.of(ExcelUploadErrorDTO.builder()
                                        .errorMessage("Invalid file format. Please upload .xlsx or .xls file")
                                        .build()))
                                .build()
                );
            }

            ExcelUploadResultDTO result = bulkUserRegistrationService.processExcelUpload(file);

            return ResponseEntity.ok(result);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ExcelUploadResultDTO.builder()
                            .totalRows(0)
                            .errors(List.of(ExcelUploadErrorDTO.builder()
                                    .errorMessage("Failed to process file: " + e.getMessage())
                                    .build()))
                            .build());
        }
    }

    @GetMapping("/templateDownload")
    public ResponseEntity<Resource> downloadTemplate() throws IOException {

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Users");

        Row headerRow = sheet.createRow(0);
        String[] headers = {
                "First Name", "Last Name", "Email", "Password",
                "Building Number", "Building Address", "Floor", "Apartment Number"
        };

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        //Example rows for the excel file if needed
//        Row exampleRow = sheet.createRow(1);
//        exampleRow.createCell(0).setCellValue("John");
//        exampleRow.createCell(1).setCellValue("Doe");
//        exampleRow.createCell(2).setCellValue("john.doe@example.com");
//        exampleRow.createCell(3).setCellValue("password123");
//        exampleRow.createCell(4).setCellValue("RESIDENT");
//        exampleRow.createCell(5).setCellValue(1);
//        exampleRow.createCell(6).setCellValue("123 Main St");
//        exampleRow.createCell(7).setCellValue(2);
//        exampleRow.createCell(8).setCellValue(201);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=user_upload_template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}