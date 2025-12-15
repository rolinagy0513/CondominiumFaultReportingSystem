package org.example.condominiumfaultreportingsystem.excel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.example.condominiumfaultreportingsystem.security.user.User;

@Data
@AllArgsConstructor
@Builder
public class UserRegistrationResult {

    private User user;
    private String plainPassword;

}
