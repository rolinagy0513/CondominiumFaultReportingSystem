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

    public void sendCompanyRequestAcceptedNotification(CompanyRequest companyRequest, GroupDTO companyGroup) {
        log.info("METHOD: sendCompanyRequestAcceptedNotification | Preparing ACCEPTED company request notification for requesterId={}",
                companyRequest.getRequesterId());

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
        log.info("METHOD: sendCompanyRequestAcceptedNotification | SENT RESPONSE notification to userId={}", userIdString);

        WelcomeCompanyNotification welcomeNotification = WelcomeCompanyNotification.builder()
                .companyName(companyRequest.getCompanyName())
                .serviceType(companyRequest.getServiceType())
                .message("A new company has joined check out their services")
                .type(NotificationType.WELCOME)
                .build();

        String groupDestination = companyGroup.getGroupName();
        messagingTemplate.convertAndSend("/topic/group/" + groupDestination, welcomeNotification);
        log.info("METHOD: sendCompanyRequestAcceptedNotification | SENT WELCOME notification to group={}", groupDestination);
    }

    public void sendCompanyRequestRejectedNotification(CompanyRequest companyRequest) {
        log.info("METHOD: sendCompanyRequestRejectedNotification | Preparing REJECTED company request notification for requesterId={}",
                companyRequest.getRequesterId());

        CompanyNotification notificationForUser = CompanyNotification.builder()
                .senderName("SYSTEM")
                .companyName(companyRequest.getCompanyName())
                .companyEmail(companyRequest.getCompanyEmail())
                .serviceType(companyRequest.getServiceType())
                .message("Your Request was rejected. Sorry!")
                .type(NotificationType.RESPONSE)
                .build();

        String userIdString = companyRequest.getRequesterId().toString();
        messagingTemplate.convertAndSendToUser(userIdString, "/queue/request-response", notificationForUser);
        log.info("METHOD: sendCompanyRequestRejectedNotification | SENT RESPONSE notification to userId={}", userIdString);
    }

    public void sendCompanyRemovedNotification(Company company, Long userId, List<Group> groups) {
        log.info("METHOD: sendCompanyRemovedNotification | Removing company={} for userId={}",
                company.getName(), userId);

        CompanyNotification notificationForUser = CompanyNotification.builder()
                .senderName("SYSTEM")
                .companyName(company.getName())
                .companyEmail(company.getEmail())
                .serviceType(company.getServiceType())
                .message("Your company has been removed from the system.")
                .type(NotificationType.COMPANY_REMOVAL)
                .build();

        String userIdString = userId.toString();
        messagingTemplate.convertAndSendToUser(userIdString, "/queue/removal", notificationForUser);
        log.info("METHOD: sendCompanyRemovedNotification | SENT COMPANY_REMOVAL to userId={}", userIdString);

        CompanyLeftNotification notificationForGroup = CompanyLeftNotification.builder()
                .companyName(company.getName())
                .serviceType(company.getServiceType())
                .message("The company: " + company.getName() + " has left the system")
                .type(NotificationType.COMPANY_REMOVAL)
                .build();

        for (Group group : groups) {
            messagingTemplate.convertAndSend("/topic/group/" + group.getGroupName(), notificationForGroup);
            log.info("METHOD: sendCompanyRemovedNotification | SENT COMPANY_REMOVAL to group={}", group.getGroupName());
        }
    }

    public void sendApartmentRequestAcceptedNotification(ApartmentRequest request, Apartment apartment, GroupDTO usersGroup) {
        log.info("METHOD: sendApartmentRequestAcceptedNotification | Accepting apartment request for requesterId={}",
                request.getRequesterId());

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
        log.info("METHOD: sendApartmentRequestAcceptedNotification | SENT RESPONSE to userId={}", userIdString);

        WelcomeUserNotification welcomeNotification = WelcomeUserNotification.builder()
                .senderName(request.getRequesterName())
                .apartmentNumber(apartment.getApartmentNumber())
                .message(request.getRequesterName() + " has joined the group")
                .type(NotificationType.WELCOME)
                .build();

        messagingTemplate.convertAndSend("/topic/group/" + usersGroup.getGroupName(), welcomeNotification);
        log.info("METHOD: sendApartmentRequestAcceptedNotification | SENT WELCOME to group={}",
                usersGroup.getGroupName());
    }

    public void sendApartmentRequestRejectedNotification(ApartmentRequest request, Apartment apartment) {
        log.info("METHOD: sendApartmentRequestRejectedNotification | Rejecting apartment request for requesterId={}",
                request.getRequesterId());

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
        log.info("METHOD: sendApartmentRequestRejectedNotification | SENT RESPONSE to userId={}", userIdString);
    }

    public void sendUserJoinedNotification(Apartment apartment, User userThatJoined, Group group){

        UserJoinedNotification notificationForGroup = UserJoinedNotification.builder()
                .userName(userThatJoined.getName())
                .apartmentNumber(apartment.getApartmentNumber())
                .message(userThatJoined.getName() + " has joined the building")
                .type(NotificationType.WELCOME)
                .build();

        messagingTemplate.convertAndSend("/topic/group/" + group.getGroupName(), notificationForGroup);
    }

    public void sendUserLeftNotification(Apartment apartment, User userThatLeft, Group group) {
        log.info("METHOD: sendUserLeftNotification | User={} leaving apartment={}",
                userThatLeft.getId(), apartment.getApartmentNumber());

        ApartmentNotification notificationForUser = ApartmentNotification.builder()
                .senderName("SYSTEM")
                .apartmentId(apartment.getId())
                .apartmentNumber(apartment.getApartmentNumber())
                .floor(apartment.getFloor())
                .apartmentStatus(apartment.getStatus())
                .buildingNumber(apartment.getBuilding().getBuildingNumber())
                .message("You have been removed from the apartment.")
                .type(NotificationType.USER_REMOVAL)
                .build();

        messagingTemplate.convertAndSendToUser(userThatLeft.getId().toString(), "/queue/removal", notificationForUser);
        log.info("METHOD: sendUserLeftNotification | SENT USER_REMOVAL to userId={}", userThatLeft.getId());

        ApartmentNotification notificationForGroup = ApartmentNotification.builder()
                .senderName("SYSTEM")
                .apartmentId(apartment.getId())
                .apartmentNumber(apartment.getApartmentNumber())
                .floor(apartment.getFloor())
                .apartmentStatus(apartment.getStatus())
                .buildingNumber(apartment.getBuilding().getBuildingNumber())
                .message("A user has left the group")
                .type(NotificationType.USER_REMOVAL_GROUP)
                .build();

        messagingTemplate.convertAndSend("/topic/group/" + group.getGroupName(), notificationForGroup);
    }

    public void sendNewPublicReportCameNotification(String groupName, String userName, Report report) {
        log.info("METHOD: sendNewPublicReportCameNotification | New PUBLIC report from user={} to group={}",
                userName, groupName);

        NewReportCameNotification notification = NewReportCameNotification.builder()
                .message("New report came")
                .reportType(report.getReportType())
                .userName(userName)
                .submittedAt(report.getCreatedAt())
                .type(NotificationType.PUBLIC_REPORT_CAME)
                .build();

        messagingTemplate.convertAndSend("/topic/group/" + groupName, notification);
        log.info("METHOD: sendNewPublicReportCameNotification | SENT PUBLIC_REPORT_CAME to group={}", groupName);
    }

    public void sendNewPrivateReportCameNotification(Long companyId, String userName, Report report) {
        log.info("METHOD: sendNewPrivateReportCameNotification | New PRIVATE report for companyId={}", companyId);

        NewReportCameNotification notification = NewReportCameNotification.builder()
                .message("New report came")
                .reportType(report.getReportType())
                .userName(userName)
                .submittedAt(report.getCreatedAt())
                .type(NotificationType.PRIVATE_REPORT_CAME)
                .build();

        messagingTemplate.convertAndSendToUser(companyId.toString(), "/queue/notification", notification);
        log.info("METHOD: sendNewPrivateReportCameNotification | SENT PRIVATE_REPORT_CAME to companyId={}", companyId);
    }

    public void sendReportSubmittedNotification(Long residentId, Company company, Report report) {
        log.info("METHOD: sendReportSubmittedNotification | Report accepted by company={} for residentId={}",
                company.getName(), residentId);

        ReportSubmittedNotification notification = ReportSubmittedNotification.builder()
                .message("Your report has been accepted by: " + company.getName())
                .reportType(report.getReportType())
                .companyName(company.getName())
                .type(NotificationType.REPORT_ACCEPTED)
                .build();

        messagingTemplate.convertAndSendToUser(residentId.toString(), "/queue/notification", notification);

    }

    public void sendReportCompletedNotification(Long residentId, Report report){

        ReportCompletedNotification notification = ReportCompletedNotification.builder()
                .reportName(report.getName())
                .companyName(report.getCompanyName())
                .cost(report.getCost())
                .message("Your report has been completed pay and give a feedback at the completed reports menu!")
                .type(NotificationType.REPORT_COMPLETED)
                .build();

        messagingTemplate.convertAndSendToUser(residentId.toString(), "/queue/notification", notification);
    }

    public void sendFeedbackNotification(Feedback feedback, Long companyId) {
        log.info("METHOD: sendFeedbackNotification | New feedback for companyId={} from={}",
                companyId, feedback.getReviewerEmail());

        FeedbackNotification notification = FeedbackNotification.builder()
                .senderEmail(feedback.getReviewerEmail())
                .rating(feedback.getRating())
                .message("A new feedback has came!")
                .build();

        messagingTemplate.convertAndSendToUser(companyId.toString(), "/queue/notification", notification);
        log.info("METHOD: sendFeedbackNotification | SENT FEEDBACK notification to companyId={}", companyId);
    }
}
