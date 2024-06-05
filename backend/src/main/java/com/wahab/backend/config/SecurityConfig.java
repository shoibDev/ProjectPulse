package com.wahab.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configures web security settings for the application, establishing security policies
 * for handling HTTP requests.
 *
 * <p>This class uses {@link EnableWebSecurity} to activate security configurations defined within.
 * It sets up a security filter chain that specifies HTTP request handling, integrating custom
 * security components such as JWT authentication filters and configuring endpoint accessibility
 * based on authentication status.</p>
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Defines the security filter chain that applies security configurations to HTTP requests.
     * This method sets up request authorization, session management policies, and integrates
     * JWT authentication filters into the Spring Security filter chain.
     *
     * @param http the {@link HttpSecurity} to be configured
     * @return the built {@link SecurityFilterChain}
     * @throws Exception if an error occurs during the configuration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // CSRF protection is disabled as JWT is immune to CSRF
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                // Configure authorization of requests
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("api/v1/auth/**", "api/v1/user/**", "api/v1/project/**", "api/v1/ticket/**").permitAll() // Permit all requests to certain matchers (e.g., public endpoints)
                        .anyRequest().authenticated() // Require authentication for all others requests
                )
                // Configure session management to be stateless
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Sessions are not used to store user's state
                )
                // Add the authentication provider
                .authenticationProvider(authenticationProvider)
                // Add JWT filter before processing with UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}