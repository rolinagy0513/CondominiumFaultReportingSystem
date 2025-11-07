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
public class ApartmentRequestDetailedInfoDTO {

    private Long requestId;

    private String requesterName;
    private Integer apartmentNumber;
    private String buildingAddress;

    private Long requesterId;
    private Long apartmentId;
    private ApartmentRequestStatus status;
    private LocalDateTime createdAt;

}
