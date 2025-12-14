package org.example.condominiumfaultreportingsystem.security.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.UserResponseDTO;
import org.example.condominiumfaultreportingsystem.apartmentRequest.ActiveApartmentRequest;
import org.example.condominiumfaultreportingsystem.companyRequest.ActiveCompanyRequest;
import org.example.condominiumfaultreportingsystem.security.user.Role;

import java.util.List;

/**
 * Data Transfer Object (DTO) representing the authentication response payload.
 * <p>
 * Returned by authentication-related endpoints (e.g., {@code /register}, {@code /authenticate}, {@code /refresh-token}).
 * </p>
 *
 * <p>
 * Contains:
 * <ul>
 *   <li>{@code message} – A status or informational message about the authentication result.</li>
 *   <li>{@code user} – A {@link UserResponseDTO} containing the authenticated user's details.</li>
 * </ul>
 * </p>
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

  private String message;
  private UserResponseDTO user;
  private Long groupId;
  private Role role;
  private ActiveApartmentRequest activeApartmentRequest;
  private ActiveCompanyRequest activeCompanyRequest;
  private boolean mustChangePassword;

}
