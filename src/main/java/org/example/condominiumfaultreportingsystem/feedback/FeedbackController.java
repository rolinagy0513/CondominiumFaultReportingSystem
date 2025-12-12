package org.example.condominiumfaultreportingsystem.feedback;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.FeedbackDTO;
import org.example.condominiumfaultreportingsystem.DTO.GiveFeedbackDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/resident/feedback/giveFeedback")
    public FeedbackDTO giveFeedback(
            @RequestBody GiveFeedbackDTO giveFeedbackDTO

    ){
        return feedbackService.giveFeedback(giveFeedbackDTO);
    }

    @GetMapping("/resident/feedback/getFeedbacksForCompany/{companyId}")
    public CompletableFuture<List<FeedbackDTO>> getFeedbacksForCompany(
            @PathVariable Long companyId
    ){
        return feedbackService.getFeedbacksForCompany(companyId);
    }

}
