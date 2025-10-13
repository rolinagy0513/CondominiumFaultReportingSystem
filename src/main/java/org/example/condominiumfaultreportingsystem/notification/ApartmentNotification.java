package org.example.condominiumfaultreportingsystem.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.apartment.ApartmentStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApartmentNotification {

    private String senderName;

    private Long apartmentId;
    private Integer apartmentNumber;
    private Integer floor;
    private ApartmentStatus apartmentStatus;

    private Integer buildingNumber;

    private String message;
    private NotificationType type;

}
