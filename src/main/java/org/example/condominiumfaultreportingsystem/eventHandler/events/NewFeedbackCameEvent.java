package org.example.condominiumfaultreportingsystem.eventHandler.events;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.feedback.Feedback;

@Getter
@AllArgsConstructor
public class NewFeedbackCameEvent {

    private Feedback feedback;
    private Long companyId;

}
