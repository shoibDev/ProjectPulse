package com.wahab.backend.config;

import com.wahab.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * The {@code JwtAuthenticationFilter} is responsible for intercepting HTTP requests to extract
 * and process the JSON Web Token (JWT) for authentication purposes. This filter ensures that each
 * request is checked for a valid JWT in the Authorization header, processing the request only if
 * the token is found and valid.
 *
 * <p>This filter extends {@link OncePerRequestFilter} to guarantee a single execution per request
 * dispatch. It checks for the presence of the 'Authorization' header and validates its format
 * to confirm it contains a bearer token.</p>
 */
@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    /**
     * Processes an HTTP request to authenticate users based on JWT found in the Authorization header.
     * This method is called once per request, following the servlet filter Java API.
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final int BEARER_PREFIX_LENGTH = 7;
        final String authHeader = request.getHeader("Authorization");

        final String jwt, userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extracting the Jwt from the auth header, assuming the token follows 'Bearer ' prefix
        jwt = authHeader.substring(BEARER_PREFIX_LENGTH);
        userEmail = jwtService.extractUsername(jwt);

    }
}
