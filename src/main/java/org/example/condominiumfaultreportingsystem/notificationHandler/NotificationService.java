package org.example.condominiumfaultreportingsystem.notificationHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequest;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.companyRequest.CompanyRequest;
import org.example.condominiumfaultreportingsystem.feedback.Feedback;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.notificationHandler.notifications.*;
import org.example.condominiumfaultreportingsystem.report.Report;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendCompanyRequestAcceptedNotification(CompanyRequest companyRequest, GroupDTO companyGroup){

        CompanyNotification notificationForUser = CompanyNotification.builder()
                .senderName("SYSTEM")
                .companyName(companyRequest.getCompanyName())
                .companyEmail(companyRequest.getCompanyEmail())
                .serviceType(companyRequest.getServiceType())
                .message("Your Request was accepted. Welcome to the system")
                .type(NotificationType.RESPONSE)
                .build();

        String userIdString = companyRequest.getRequesterId().toString();
        messagingTemplate.convertAndSendToUser(userIdString, "/queue/request-response", notificationForUser);

        WelcomeCompanyNotification welcomeNotification = WelcomeCompanyNotification.builder()
                .companyName(companyRequest.getCompanyName())
                .serviceType(companyRequest.getServiceType())
                .message("A new company has joined check out their services")
                .type(NotificationType.WELCOME)
                .build();

        String groupDestination = companyGroup.getGroupName();
        messagingTemplate.convertAndSend("/topic/group/" + groupDestination, welcomeNotification);
    }

    public void sendCompanyRequestRejectedNotification(CompanyRequest companyRequest){

        CompanyNotification notificationForUser = CompanyNotification.builder()
                .senderName("SYSTEM")
                .companyName(companyRequest.getCompanyName())
                .companyEmail(companyRequest.getCompanyEmail())
                .serviceType(companyRequest.getServiceType())
                .message("Your Request was rejected. Sorry!")
                .type(NotificationType.RESPONSE)
                .build();

        String userIdString = companyRequest.getRequesterId().toString();
        messagingTemplate.convertAndSendToUser(userIdString,"/queue/request-response",notificationForUser);

    }

    public void sendCompanyRemovedNotification(Company company, Long userId, List<Group> groups){

        CompanyNotification notificationForUser = CompanyNotification.builder()
                .senderName("SYSTEM")
                .companyName(company.getName())
                .companyEmail(company.getEmail())
                .serviceType(company.getServiceType())
                .message("Your company has been removed from the system. You no longer have access to the company related features.")
                .type(NotificationType.REMOVAL)
                .build();

        String userIdString = userId.toString();
        messagingTemplate.convertAndSendToUser(userIdString,"/queue/removal",notificationForUser);

        CompanyLeftNotification notificationForGroup = CompanyLeftNotification.builder()
                .companyName(company.getName())
                .serviceType(company.getServiceType())
                .message("The company: " + company.getName() + " has left the system")
                .type(NotificationType.MEMBER_LEFT)
                .build();

        for (Group group : groups){

            String groupDestination = group.getGroupName();
            messagingTemplate.convertAndSend("/topic/group/" + groupDestination, notificationForGroup);

        }

    }

    public void sendApartmentRequestAcceptedNotification(ApartmentRequest request, Apartment apartment, GroupDTO usersGroup){

        ApartmentNotification notificationForUser = ApartmentNotification.builder()
                .senderName("SYSTEM")
                .apartmentId(apartment.getId())
                .apartmentNumber(apartment.getApartmentNumber())
                .floor(apartment.getFloor())
                .apartmentStatus(apartment.getStatus())
                .buildingNumber(apartment.getBuilding().getBuildingNumber())
                .message("Your Request was accepted. Welcome to the system")
                .type(NotificationType.RESPONSE)
                .build();

        String userIdString = request.getRequesterId().toString();
        messagingTemplate.convertAndSendToUser(userIdString, "/queue/request-response", notificationForUser);
        log.info("SENT");

        WelcomeUserNotification welcomeNotification = WelcomeUserNotification.builder()
                .senderName(request.getRequesterName())
                .apartmentNumber(apartment.getApartmentNumber())
                .message(request.getRequesterName() + " has joined the group")
                .type(NotificationType.WELCOME)
                .build();

        String groupDestination = usersGroup.getGroupName();
        messagingTemplate.convertAndSend("/topic/group/" + groupDestination, welcomeNotification);
    }

    public void sendApartmentRequestRejectedNotification(ApartmentRequest request, Apartment apartment){

        ApartmentNotification notificationForUser = ApartmentNotification.builder()
                .senderName("SYSTEM")
                .apartmentId(apartment.getId())
                .apartmentNumber(apartment.getApartmentNumber())
                .floor(apartment.getFloor())
                .apartmentStatus(apartment.getStatus())
                .buildingNumber(apartment.getBuilding().getBuildingNumber())
                .message("Your Request was rejected. Sorry!")
                .build();

        String userIdString = request.getRequesterId().toString();
        messagingTemplate.convertAndSendToUser(userIdString, "/queue/request-response", notificationForUser);

    }

    public void sendUserLeftNotification(Apartment apartment, User userThatLeft, Group group){

        ApartmentNotification notificationForUser = ApartmentNotification.builder()
                .senderName("SYSTEM")
                .apartmentId(apartment.getId())
                .apartmentNumber(apartment.getApartmentNumber())
                .floor(apartment.getFloor())
                .apartmentStatus(apartment.getStatus())
                .buildingNumber(apartment.getBuilding().getBuildingNumber())
                .message("You has been removed from the apartment.")
                .build();

        String userIdString = userThatLeft.getId().toString();
        messagingTemplate.convertAndSendToUser(userIdString, "/queue/removal", notificationForUser);

        UserLeftNotification notificationForGroup = UserLeftNotification.builder()
                .userName(userThatLeft.getName())
                .apartmentNumber(apartment.getApartmentNumber())
                .message(userThatLeft.getName() + " has left from the " + apartment.getApartmentNumber() + " apartment")
                .type(NotificationType.REMOVAL)
                .build();

        String groupDestination = group.getGroupName();

        messagingTemplate.convertAndSend("/topic/group/" + groupDestination, notificationForGroup);
    }

    public void sendNewPublicReportCameNotification(String groupName, String userName, Report report){

        NewReportCameNotification newReportCameNotification = NewReportCameNotification.builder()
                .message("New report came")
                .reportType(report.getReportType())
                .userName(userName)
                .submittedAt(report.getCreatedAt())
                .build();

        messagingTemplate.convertAndSend("/topic/group/" + groupName, newReportCameNotification);
    }

    public void sendNewPrivateReportCameNotification(Long companyId, String userName, Report report){

        NewReportCameNotification newReportCameNotification = NewReportCameNotification.builder()
                .message("New report came")
                .reportType(report.getReportType())
                .userName(userName)
                .submittedAt(report.getCreatedAt())
                .build();

        String companyIdString = companyId.toString();

        messagingTemplate.convertAndSendToUser(companyIdString, "/queue/notification", newReportCameNotification);

    }

    public void sendReportSubmittedNotification(Long residentId, Company company, Report report){

        ReportSubmittedNotification reportSubmittedNotification = ReportSubmittedNotification.builder()
                .message("A company has selected your report.")
                .reportType(report.getReportType())
                .companyName(company.getName())
                .build();

        String residentIdString = residentId.toString();

        messagingTemplate.convertAndSendToUser(residentIdString,"/queue/notification", reportSubmittedNotification);
    }

    public void sendFeedbackNotification(Feedback feedback, Long companyId){

        FeedbackNotification feedbackNotification = FeedbackNotification.builder()
                .senderEmail(feedback.getReviewerEmail())
                .rating(feedback.getRating())
                .message("A new feedback has came!")
                .build();

        String companyIdString = companyId.toString();

        messagingTemplate.convertAndSendToUser(companyIdString,"queue/notification", feedbackNotification);

    }

}
