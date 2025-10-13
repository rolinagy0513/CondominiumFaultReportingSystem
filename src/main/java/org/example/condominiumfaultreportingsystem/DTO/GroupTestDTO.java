package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.security.user.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupTestDTO {

    private Long groupId;
    private String groupName;
    private User user;

}
