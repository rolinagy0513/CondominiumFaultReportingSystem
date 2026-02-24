package org.example.condominiumfaultreportingsystem.email;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemporaryPasswordRecipient {

    private String email;
    private String name;
    private String temporaryPasswordToken;

}
