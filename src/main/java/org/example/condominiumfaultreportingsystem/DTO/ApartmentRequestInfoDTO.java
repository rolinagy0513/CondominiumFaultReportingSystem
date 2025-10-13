package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ApartmentRequestStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApartmentRequestInfoDTO {

    private Long requestId;

    private Long requesterId;
    private Long apartmentId;
    private ApartmentRequestStatus status;
    private LocalDateTime createdAt;

}
