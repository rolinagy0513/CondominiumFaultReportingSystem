package org.example.condominiumfaultreportingsystem.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.security.config.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * AuthHandshakeInterceptor is a WebSocket {@link HandshakeInterceptor} that
 * validates JWT tokens during the WebSocket handshake process.
 * <p>
 * It extracts tokens from cookies, query parameters, or headers, validates them
 * using {@link JwtService}, and attaches user information to the WebSocket session.
 * If the token is missing or invalid, the handshake will be rejected with {@code 401 UNAUTHORIZED}.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;

    /**
     * Called before the WebSocket handshake is processed.
     * <p>
     * Validates the JWT token from the request. If the token is valid,
     * stores user information in session attributes; otherwise rejects the handshake.
     *
     * @param request    the current HTTP request
     * @param response   the current HTTP response
     * @param wsHandler  the WebSocket handler
     * @param attributes the attributes map for the WebSocket session
     * @return {@code true} if the handshake should proceed, {@code false} if rejected
     * @throws Exception if an error occurs during validation
     */
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        String token = extractTokenFromRequest(request);

        if (token == null) {
            log.warn("WebSocket handshake rejected: No token provided");
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        try {
            if (!jwtService.isTokenValid(token)) {
                log.warn("WebSocket handshake rejected: Invalid token");
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return false;
            }

            String username = jwtService.extractUsername(token);
            attributes.put("username", username);
            attributes.put("token", token);

            return true;

        } catch (Exception e) {
            log.error("WebSocket handshake failed: {}", e.getMessage());
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }
    }

    /**
     * Called after the WebSocket handshake is processed.
     * <p>
     * Logs any exceptions that occur during handshake completion.
     *
     * @param request   the current HTTP request
     * @param response  the current HTTP response
     * @param wsHandler the WebSocket handler
     * @param exception an exception raised during handshake, or {@code null} if none
     */
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        if (exception != null) {
            log.error("WebSocket handshake completed with exception: {}", exception.getMessage());
        }
    }

    /**
     * Extracts a JWT token from the request.
     * <p>
     * Tries cookies first, then query parameters, and finally request headers.
     *
     * @param request the current HTTP request
     * @return the extracted JWT token, or {@code null} if none is found
     */
    private String extractTokenFromRequest(ServerHttpRequest request) {
        String token = extractTokenFromCookies(request);
        if (token != null) {
            return token;
        }

        token = extractTokenFromQuery(request);
        if (token != null) {
            return token;
        }

        return extractTokenFromHeaders(request);
    }

    /**
     * Extracts a JWT token from cookies.
     *
     * @param request the current HTTP request
     * @return the JWT token from cookies, or {@code null} if not found
     */
    private String extractTokenFromCookies(ServerHttpRequest request) {
        String cookieHeader = request.getHeaders().getFirst("Cookie");
        if (cookieHeader != null) {
            String[] cookies = cookieHeader.split(";");
            for (String cookie : cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith("jwt=")) {
                    return cookie.substring(4);
                }
                if (cookie.startsWith("access_token=")) {
                    return cookie.substring(13);
                }
                if (cookie.startsWith("access_token")) {
                    return cookie.substring(12);
                }
            }
        }
        return null;
    }

    /**
     * Extracts a JWT token from query parameters.
     * <p>
     * Looks for a parameter named {@code token}.
     *
     * @param request the current HTTP request
     * @return the JWT token from query parameters, or {@code null} if not found
     */
    private String extractTokenFromQuery(ServerHttpRequest request) {
        String query = request.getURI().getQuery();
        if (query != null) {
            String[] queryParams = query.split("&");
            for (String param : queryParams) {
                if (param.startsWith("token=")) {
                    return param.substring(6);
                }
            }
        }
        return null;
    }

    /**
     * Extracts a JWT token from the Authorization header.
     * <p>
     * Expects the header to start with {@code Bearer }.
     *
     * @param request the current HTTP request
     * @return the JWT token from the Authorization header, or {@code null} if not found
     */
    private String extractTokenFromHeaders(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
