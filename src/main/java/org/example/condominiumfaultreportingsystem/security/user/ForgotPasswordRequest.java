package org.example.condominiumfaultreportingsystem.security.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ForgotPasswordRequest {

    private String newPassword;
    private String confirmationPassword;
    private String resetToken;

}
