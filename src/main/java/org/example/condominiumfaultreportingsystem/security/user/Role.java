package org.example.condominiumfaultreportingsystem.security.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.example.condominiumfaultreportingsystem.security.user.Permission.*;

/**
 * An ENUM for the roles inside the app
 * Either simple USER, ADMIN or MANAGER
 * Or the project specific TRAINER for the different functionalities and UI
 */
@RequiredArgsConstructor
public enum Role {

  USER(Collections.emptySet()),
  ADMIN(
          Set.of(
                  ADMIN_READ,
                  ADMIN_UPDATE,
                  ADMIN_DELETE,
                  ADMIN_CREATE,
                  COMPANY_READ,
                  COMPANY_UPDATE,
                  COMPANY_DELETE,
                  COMPANY_CREATE
          )
  ),
  COMPANY(
          Set.of(
                  COMPANY_READ,
                  COMPANY_UPDATE,
                  COMPANY_DELETE,
                  COMPANY_CREATE
          )
  )

  ;

  @Getter
  private final Set<Permission> permissions;

  /**
   * Method for retrieving the authorities for a user based on the user's role
   * @return The authorities
   */
  public List<SimpleGrantedAuthority> getAuthorities() {
    var authorities = getPermissions()
            .stream()
            .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
            .collect(Collectors.toList());
    authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
    return authorities;
  }
}
