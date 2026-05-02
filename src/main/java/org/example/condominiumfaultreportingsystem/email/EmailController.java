package org.example.condominiumfaultreportingsystem.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.DTO.UserEmailDTO;
import org.example.condominiumfaultreportingsystem.security.user.ForgotPasswordRequest;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.example.condominiumfaultreportingsystem.security.user.UserRepository;
import org.example.condominiumfaultreportingsystem.security.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;
    private final UserService userService;

    private final UserRepository userRepository;

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

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> requestPasswordReset(@RequestBody ForgotPasswordEmailRequest request) {
        try {
            UserEmailDTO result = userService.emailValidation(request.getEmail());
            User user = userRepository.findByEmail(result.getUsersEmail()).orElseThrow();
            emailService.sendPasswordResetEmail(
                    result.getUsersEmail(),
                    user.getFirstname(),
                    result.getResetToken()
            );
        } catch (Exception e) {
            log.warn("Password reset requested for unknown or failed email: {}", e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request);
        return ResponseEntity.ok().build();
    }

}
