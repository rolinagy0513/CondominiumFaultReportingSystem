package org.example.condominiumfaultreportingsystem.email;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

//    @PostMapping("/send")
//    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request) {
//        emailService.sendEmail(request.getTo(), request.getSubject(), request.getBody());
//        return ResponseEntity.ok("Email sent successfully!");
//    }

    @PostMapping("/send-welcomeResident")
    public ResponseEntity<String> sendWelcomeResidentEmail(@RequestBody EmailRequestResident request) {
        emailService.sendWelcomeResidentEmail(request.getTo(), request.getName(), request.getBuildingAddress(), request.getApartmentNumber());
        return ResponseEntity.ok("Welcome email sent successfully!");
    }

    @PostMapping("/send-welcomeCompany")
    public ResponseEntity<String> sendWelcomeCompanyEmail(@RequestBody EmailRequestCompany request) {
        emailService.sendWelcomeCompanyEmail(request.getTo(), request.getName(), request.getBuildingAddress());
        return ResponseEntity.ok("Welcome email sent successfully!");
    }

}
