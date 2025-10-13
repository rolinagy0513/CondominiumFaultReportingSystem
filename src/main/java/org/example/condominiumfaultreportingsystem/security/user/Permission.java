package org.example.condominiumfaultreportingsystem.security.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * An ENUM for the permissions inside the application
 */
@RequiredArgsConstructor
public enum Permission {

    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),
    COMPANY_READ("company:read"),
    COMPANY_UPDATE("company:update"),
    COMPANY_CREATE("company:create"),
    COMPANY_DELETE("company:delete")

    ;

    @Getter
    private final String permission;
}
