package org.example.condominiumfaultreportingsystem.pdf;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/")
public class PdfGeneratorController {

    private final PdfGeneratorService pdfGeneratorService;

    @PostMapping("/resident/pdf/download")
    public ResponseEntity<byte[]> generateInvoicePdf(
            @RequestBody InvoiceData invoiceData
    ) throws IOException {
        byte[] pdfBytes = pdfGeneratorService.generateInvoicePdf(invoiceData);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.add("Content-Disposition", "attachment; filename=invoice_" +
                invoiceData.getInvoiceNumber() + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}