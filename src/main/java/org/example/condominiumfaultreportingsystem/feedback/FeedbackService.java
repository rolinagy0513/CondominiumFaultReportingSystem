package org.example.condominiumfaultreportingsystem.feedback;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.FeedbackDTO;
import org.example.condominiumfaultreportingsystem.DTO.GiveFeedbackDTO;
import org.example.condominiumfaultreportingsystem.DTO.UserDTO;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.company.CompanyRepository;
import org.example.condominiumfaultreportingsystem.company.impl.CompanyService;
import org.example.condominiumfaultreportingsystem.eventHandler.events.NewFeedbackCameEvent;
import org.example.condominiumfaultreportingsystem.exception.CanNotSendFeedbackException;
import org.example.condominiumfaultreportingsystem.exception.CompanyNotFoundException;
import org.example.condominiumfaultreportingsystem.exception.ReportNotFoundException;
import org.example.condominiumfaultreportingsystem.report.Report;
import org.example.condominiumfaultreportingsystem.report.ReportRepository;
import org.example.condominiumfaultreportingsystem.report.ReportStatus;
import org.example.condominiumfaultreportingsystem.security.user.UserService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final UserService userService;

    private final FeedbackRepository feedbackRepository;
    private final CompanyRepository companyRepository;

    private final ApplicationEventPublisher eventPublisher;
    private final ReportRepository reportRepository;
    private final CompanyService companyService;

    @Transactional
    public FeedbackDTO giveFeedback(GiveFeedbackDTO giveFeedbackDTO){

        UserDTO userDTO = userService.getCurrentUser();
        String currentUserEmail = userDTO.getUserName();

        Optional<Report> reportOpt = reportRepository.getReportByIdWithUser(giveFeedbackDTO.getReportId());

        if (reportOpt.isEmpty()){
            throw new ReportNotFoundException();
        }

        Report report = reportOpt.get();

        Optional<Feedback> feedbackOpt = feedbackRepository.getFeedbackByReportId(report.getId());

        if (feedbackOpt.isPresent()){
            throw new CanNotSendFeedbackException("You already sent a feedback for this report");
        }

        validateFeedback(report,userDTO.getId());

        Long companyId = report.getCompanyId();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(()-> new CompanyNotFoundException(companyId));

        Feedback newFeedback = Feedback.builder()
                .rating(giveFeedbackDTO.getRating())
                .message(giveFeedbackDTO.getMessage())
                .createdAt(LocalDateTime.now())
                .reviewerEmail(currentUserEmail)
                .company(company)
                .report(report)
                .build();

        Double overallRating = companyService.calculateOverallRating(companyId, company.getOverallRating(), newFeedback.getRating());

        company.setOverallRating(overallRating);

        companyRepository.save(company);
        feedbackRepository.save(newFeedback);

        report.setReportStatus(ReportStatus.PAYED);
        reportRepository.save(report);

        eventPublisher.publishEvent(
                new NewFeedbackCameEvent(newFeedback, company.getId())
        );

        return mapToDto(newFeedback);

    }

    @Async("asyncExecutor")
    public CompletableFuture<List<FeedbackDTO>> getFeedbacksForCompany(Long companyId){

        Optional<Company> companyOpt = companyRepository.findCompanyWithFeedbacks(companyId);

        if (companyOpt.isEmpty()){
            throw new CompanyNotFoundException(companyId);
        }

        Company company = companyOpt.get();

        List<Feedback> feedbacks = company.getFeedbacks();

        List<FeedbackDTO> feedbackDTOS = feedbacks.stream().map(this::mapToDto).toList();

        return CompletableFuture.completedFuture(feedbackDTOS);

    }

    private void validateFeedback(Report report, Long userId){

        if (!report.getUser().getId().equals(userId)){
            throw new CanNotSendFeedbackException("Can not send the feedback cause the report is not belonging to this user");
        }

        if (report.getCompanyId() == null){
            throw new CanNotSendFeedbackException("The feedback can not be sent because the companyId is null");
        }

        if (!report.getReportStatus().equals(ReportStatus.DONE)){
            throw new CanNotSendFeedbackException("The report is not done yet!");
        }

    }

    private FeedbackDTO mapToDto(Feedback feedback){

        return FeedbackDTO.builder()
                .rating(feedback.getRating())
                .message(feedback.getMessage())
                .createdAt(feedback.getCreatedAt())
                .reviewerEmail(feedback.getReviewerEmail())
                .build();

    }

}
