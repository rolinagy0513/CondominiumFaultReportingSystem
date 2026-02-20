package org.example.condominiumfaultreportingsystem.email;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final SendGrid sendGrid;
    private static final String FROM_EMAIL = "homelink.sendgrid@gmail.com";
    private final TemplateEngine templateEngine;


//    public void sendEmail(String toEmail, String subject, String body) {
//        Email from = new Email(FROM_EMAIL);
//        Email to = new Email(toEmail);
//        Content content = new Content("text/plain", body);
//        Mail mail = new Mail(from, subject, to, content);
//
//        Request request = new Request();
//        try {
//            request.setMethod(Method.POST);
//            request.setEndpoint("mail/send");
//            request.setBody(mail.build());
//            Response response = sendGrid.api(request);
//            if (response.getStatusCode() >= 400) {
//                throw new RuntimeException("Failed to send email. Status: " + response.getStatusCode() + " Body: " + response.getBody());
//            }
//        } catch (IOException e) {
//            throw new RuntimeException("Error sending email via SendGrid", e);
//        }
//    }

    public void sendWelcomeEmail(String toEmail, String name) {
        Context context = new Context();
        context.setVariable("name", name);
        String htmlBody = templateEngine.process("email/welcome", context);

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

}
