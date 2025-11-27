package org.example.condominiumfaultreportingsystem.report;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;
import org.example.condominiumfaultreportingsystem.DTO.ReportDTO;
import org.example.condominiumfaultreportingsystem.DTO.ReportRequestDTO;
import org.example.condominiumfaultreportingsystem.DTO.UserDTO;
import org.example.condominiumfaultreportingsystem.eventHandler.events.NewReportCameEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.UserLeftEvent;
import org.example.condominiumfaultreportingsystem.exception.GroupNotFoundException;
import org.example.condominiumfaultreportingsystem.exception.UserAssignedToMultipleGroupsException;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.group.GroupRepository;
import org.example.condominiumfaultreportingsystem.group.impl.GroupService;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.example.condominiumfaultreportingsystem.security.user.UserService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {

    //Add a report(Private or Public) - RESIDENT
    //Send a report response - COMPANY
    //Get all public reports - both
    //Get all private reports - COMPANY
    //Get a report by id
    //Remove report

    private final ReportRepository reportRepository;
    private final GroupRepository groupRepository;
    private final UserService userService;

    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ReportDTO sendPublicReport(ReportRequestDTO reportRequestDTO){

        User user  = userService.getCurrentUserTemporary();

        List<Group> userGroups = groupRepository.findByUsersId(user.getId());

        validateGroup(userGroups);

        Group group  = userGroups.getFirst();
        String groupDestination = group.getGroupName();

        Report newReport = Report.builder()
                .groupId(group.getId())
                .reportPrivacy(ReportPrivacy.PUBLIC)
                .name(reportRequestDTO.getName())
                .issueDescription(reportRequestDTO.getIssueDescription())
                .comment(reportRequestDTO.getComment())
                .roomNumber(reportRequestDTO.getRoomNumber())
                .floor(reportRequestDTO.getFloor())
                .reportStatus(ReportStatus.SUBMITTED)
                .reportType(reportRequestDTO.getReportType())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        reportRepository.save(newReport);

        eventPublisher.publishEvent(
                new NewReportCameEvent(groupDestination, user.getUserName(), newReport)
        );

        return mapToDto(newReport);

    }

//    public List<ReportDTO> getAllPublicReports(){
//
//    }

    private void validateGroup(List<Group> userGroups){

        if (userGroups.isEmpty()){
            throw new GroupNotFoundException();
        }

        if (userGroups.size() > 1){
            throw new UserAssignedToMultipleGroupsException();
        }

    }

    private ReportDTO mapToDto(Report report){

        return ReportDTO.builder()
                .senderName(report.getUser().getName())
                .reportPrivacy(report.getReportPrivacy())
                .name(report.getName())
                .issueDescription(report.getIssueDescription())
                .comment(report.getComment())
                .roomNumber(report.getRoomNumber())
                .floor(report.getFloor())
                .reportStatus(report.getReportStatus())
                .reportType(report.getReportType())
                .build();
    }

}
