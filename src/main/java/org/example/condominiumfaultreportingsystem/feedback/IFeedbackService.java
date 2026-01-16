package org.example.condominiumfaultreportingsystem.feedback;

import org.example.condominiumfaultreportingsystem.DTO.FeedbackDTO;
import org.example.condominiumfaultreportingsystem.DTO.GiveFeedbackDTO;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IFeedbackService {
    FeedbackDTO giveFeedback(GiveFeedbackDTO giveFeedbackDTO);
    CompletableFuture<List<FeedbackDTO>> getFeedbacksForCompany(Long companyId);
}
