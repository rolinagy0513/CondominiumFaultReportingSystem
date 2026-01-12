package org.example.condominiumfaultreportingsystem.pdf;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PdfGeneratorService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    public byte[] generateInvoicePdf(InvoiceData invoice) throws IOException {
        String htmlContent = loadAndPopulateTemplate(invoice);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new IOException("Failed to generate PDF from HTML", e);
        }
    }

    private String loadAndPopulateTemplate(InvoiceData invoice) throws IOException {

        ClassPathResource resource = new ClassPathResource("templates/invoice-template.html");
        String template = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        return template
                .replace("${invoiceNumber}", invoice.getInvoiceNumber())
                .replace("${customerName}", invoice.getCustomerName())
                .replace("${buildingNumber}", String.valueOf(invoice.getBuildingNumber()))
                .replace("${roomNumber}", String.valueOf(invoice.getRoomNumber()))
                .replace("${companyName}", invoice.getCompanyName())
                .replace("${reportName}", invoice.getReportName())
                .replace("${cost}", String.format("%.2f", invoice.getCost()))
                .replace("${payedAt}", invoice.getPayedAt() != null ?
                        invoice.getPayedAt().format(DATE_FORMATTER) : "N/A");
    }
}