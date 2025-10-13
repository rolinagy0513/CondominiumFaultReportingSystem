package org.example.condominiumfaultreportingsystem.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.ServiceType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyNotification {

    private String senderName;

    private String companyName;
    private String companyEmail;
    private ServiceType serviceType;

    private String message;
    private  NotificationType type;

}
