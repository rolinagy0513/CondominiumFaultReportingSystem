package org.example.condominiumfaultreportingsystem.email;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.exception.EmailLimitReachedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final SendGrid sendGrid;

    @Value("${email.sender}")
    private String FROM_EMAIL;

    @Value("${email.max}")
    private Integer maxEmailPerDay;

    private final TemplateEngine templateEngine;


    public void sendWelcomeResidentEmail(String toEmail, String name, String buildingAddress, Integer apartmentNumber) {

        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("buildingAddress", buildingAddress);
        context.setVariable("apartmentNumber", apartmentNumber);
        String htmlBody = templateEngine.process("email/welcomeResident", context);

        Email from = new Email(FROM_EMAIL);
        Email to = new Email(toEmail);
        Content content = new Content("text/html", htmlBody);
        Mail mail = new Mail(from, "Welcome to HomeLink!", to, content);

        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGrid.api(request);
            if (response.getStatusCode() >= 400) {
                throw new RuntimeException("Failed to send email. Status: " + response.getStatusCode());
            }
        } catch (IOException e) {
            throw new RuntimeException("Error sending email via SendGrid", e);
        }

    }

    public void sendWelcomeCompanyEmail(String toEmail, String name, String buildingAddress){

        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("buildingAddress", buildingAddress);
        String htmlBody = templateEngine.process("email/welcomeCompany", context);

        Email from = new Email(FROM_EMAIL);
        Email to = new Email(toEmail);
        Content content = new Content("text/html", htmlBody);
        Mail mail = new Mail(from, "Welcome to HomeLink!", to, content);

        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGrid.api(request);
            if (response.getStatusCode() >= 400) {
                throw new RuntimeException("Failed to send email. Status: " + response.getStatusCode());
            }
        } catch (IOException e) {
            throw new RuntimeException("Error sending email via SendGrid", e);
        }

    }

    public void sendTemporaryPasswordEmail(String buildingAddress, List<TemporaryPasswordRecipient> recipients) {

        if (recipients.size() > maxEmailPerDay){
            throw new EmailLimitReachedException();
        }

        List<String> errors = new ArrayList<>();

        for (TemporaryPasswordRecipient recipient : recipients) {
            try {
                Context context = new Context();
                context.setVariable("name", recipient.getName());
                context.setVariable("buildingAddress", buildingAddress);
                context.setVariable("temporaryPassword", recipient.getTemporaryPasswordToken());
                String htmlBody = templateEngine.process("email/temporaryPassword", context);

                Email from = new Email(FROM_EMAIL);
                Email to = new Email(recipient.getEmail());
                Content content = new Content("text/html", htmlBody);
                Mail mail = new Mail(from, "Welcome to HomeLink!", to, content);

                Request request = new Request();
                request.setMethod(Method.POST);
                request.setEndpoint("mail/send");
                request.setBody(mail.build());
                Response response = sendGrid.api(request);

                if (response.getStatusCode() >= 400) {
                    errors.add("Failed to send to " + recipient.getEmail() + " (status: " + response.getStatusCode() + ")");
                }
            } catch (IOException e) {
                errors.add("Error sending to " + recipient.getEmail() + ": " + e.getMessage());
            }
        }

        if (!errors.isEmpty()) {
            throw new RuntimeException("Failed to send some temporary password emails:\n" + String.join("\n", errors));
        }
    }


}
