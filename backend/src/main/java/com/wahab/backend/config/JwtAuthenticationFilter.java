package com.wahab.backend.config;

import com.wahab.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
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
@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    /**
     * Processes an HTTP request to authenticate users based on JWT found in the Authorization header.
     * This method is called once per request, following the servlet filter Java API.
     *
     * @param request the HTTP request
     * @param response the HTTP response
     * @param filterChain the chain of filters
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs during request processing
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt, userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // If no Authorization header is found, or it doesn't start with "Bearer ", continue the filter chain without processing
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the JWT from the Authorization header by trimming the "Bearer " prefix
        jwt = authHeader.substring("Bearer ".length());
        userEmail = jwtService.extractUsername(jwt);

        // If the userEmail is extracted and there is no authentication data in the security context
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Validate the extracted token with the userDetails
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Create authentication token if the JWT is valid
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                // Set the details of the HTTP request to the authentication token
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Update the Security Context with the authentication token
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}