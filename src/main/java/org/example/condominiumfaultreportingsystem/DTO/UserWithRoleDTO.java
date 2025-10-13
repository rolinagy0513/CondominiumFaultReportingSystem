package org.example.condominiumfaultreportingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.security.user.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserWithRoleDTO {

    private Long id;
    private String userName;
    private Role role;

}
