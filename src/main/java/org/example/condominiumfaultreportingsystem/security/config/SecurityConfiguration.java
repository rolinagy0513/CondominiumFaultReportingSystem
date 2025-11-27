package org.example.condominiumfaultreportingsystem.security.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.example.condominiumfaultreportingsystem.security.user.Permission.*;
import static org.example.condominiumfaultreportingsystem.security.user.Role.*;
import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

/**
 * Security configuration class responsible for setting up application-wide security policies.
 *
 * <p>This includes:</p>
 * <ul>
 *   <li>Configuring Cross-Origin Resource Sharing (CORS) rules to control allowed origins and methods.</li>
 *   <li>Defining public endpoints that do not require authentication.</li>
 *   <li>Setting up the security filter chain to enforce authentication and authorization on protected routes.</li>
 *   <li>Integrating JWT filters or other authentication mechanisms as part of the request processing pipeline.</li>
 * </ul>
 *
 * <p>This configuration ensures that only authorized requests can access secured resources,
 * while allowing free access to publicly exposed APIs.</p>
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private static final String[] WHITE_LIST_URL = {
            "/api/Auth/**",
            "/api/webhook/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html"};
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5174","http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        XorCsrfTokenRequestAttributeHandler requestHandler = new XorCsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName(null);

        http
                .cors(cors->cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                        req.requestMatchers(WHITE_LIST_URL)
                                .permitAll()

                                .requestMatchers("/api/admin/**").hasAnyRole(ADMIN.name())
                                .requestMatchers(GET, "/api/admin/**").hasAnyAuthority(ADMIN_READ.name())
                                .requestMatchers(POST, "/api/admin/**").hasAnyAuthority(ADMIN_CREATE.name())
                                .requestMatchers(PUT, "/api/admin/**").hasAnyAuthority(ADMIN_UPDATE.name())
                                .requestMatchers(DELETE, "/api/admin/**").hasAnyAuthority(ADMIN_DELETE.name())

                                .requestMatchers("/api/company/**").hasAnyRole(COMPANY.name(), ADMIN.name())
                                .requestMatchers(GET, "/api/company/**").hasAnyAuthority(COMPANY_READ.name(), ADMIN_READ.name())
                                .requestMatchers(POST, "/api/company/**").hasAnyAuthority(COMPANY_CREATE.name(), ADMIN_CREATE.name())
                                .requestMatchers(PUT, "/api/company/**").hasAnyAuthority(COMPANY_UPDATE.name(), ADMIN_UPDATE.name())
                                .requestMatchers(DELETE, "/api/company/**").hasAnyAuthority(COMPANY_DELETE.name(), ADMIN_DELETE.name())

                                .requestMatchers("/api/resident/**").hasAnyRole(RESIDENT.name(), ADMIN.name())
                                .requestMatchers(GET, "/api/resident/**").hasAnyAuthority(RESIDENT_READ.name(), ADMIN_READ.name())
                                .requestMatchers(POST, "/api/resident/**").hasAnyAuthority(RESIDENT_CREATE.name(),ADMIN_CREATE.name())
                                .requestMatchers(PUT, "/api/resident/**").hasAnyAuthority(RESIDENT_UPDATE.name(), ADMIN_UPDATE.name())
                                .requestMatchers(DELETE, "/api/resident/**").hasAnyAuthority(RESIDENT_DELETE.name(), ADMIN_DELETE.name())

                                .requestMatchers("/api/shared/**").hasAnyRole(RESIDENT.name(), COMPANY.name(), ADMIN.name())
                                .requestMatchers(GET, "/api/shared/**").hasAnyAuthority(RESIDENT_READ.name(), COMPANY_READ.name(), ADMIN_READ.name())
                                .requestMatchers(POST, "/api/shared/**").hasAnyAuthority(RESIDENT_CREATE.name(), COMPANY_CREATE.name(), ADMIN_CREATE.name())
                                .requestMatchers(PUT, "/api/shared/**").hasAnyAuthority(RESIDENT_UPDATE.name(), COMPANY_UPDATE.name(), ADMIN_UPDATE.name())
                                .requestMatchers(DELETE, "/api/shared/**").hasAnyAuthority(RESIDENT_DELETE.name(), COMPANY_DELETE.name(), ADMIN_DELETE.name())

                                .anyRequest()
                                .authenticated()
                )
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");

                            Map<String, Object> errorDetails = new HashMap<>();
                            errorDetails.put("timestamp", LocalDateTime.now().toString());
                            errorDetails.put("status", HttpServletResponse.SC_FORBIDDEN);
                            errorDetails.put("error", "Forbidden");
                            errorDetails.put("message", "Unauthorized: You don't have permission to access this resource");
                            errorDetails.put("path", request.getRequestURI());

                            ObjectMapper mapper = new ObjectMapper();
                            mapper.registerModule(new JavaTimeModule());
                            mapper.writeValue(response.getOutputStream(), errorDetails);
                        })
                )
                .securityContext(context->{
                    context.requireExplicitSave(false);
                })
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/api/Auth/logout")
                        .addLogoutHandler(logoutHandler)
                        .logoutSuccessHandler((request, response, authentication) -> {
                            SecurityContextHolder.clearContext();
                        })
                );
        return http.build();
    }
}