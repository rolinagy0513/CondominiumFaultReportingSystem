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

    @PostMapping("/send-welcome")
    public ResponseEntity<String> sendWelcomeEmail(@RequestBody EmailRequest request) {
        emailService.sendWelcomeEmail(request.getTo(), request.getName());
        return ResponseEntity.ok("Welcome email sent successfully!");
    }

}
