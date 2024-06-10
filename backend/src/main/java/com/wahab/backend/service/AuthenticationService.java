package com.wahab.backend.service;


import com.wahab.backend.auth.AuthenticationRequest;
import com.wahab.backend.auth.AuthenticationResponse;
import com.wahab.backend.auth.RegisterRequest;
import com.wahab.backend.entity.User;
import com.wahab.backend.repository.UserRepository;
import com.wahab.backend.security.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service class responsible for handling authentication and registration processes.
 * This includes managing user registration, user authentication, and token generation
 * for authenticated users.
 *
 * <p>The service integrates tightly with Spring Security for authenticating credentials
 * and generating JWT tokens for secure API access.</p>
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Registers a new user with the system. This method handles user creation, including
     * encoding the password and assigning a default role. A JWT token is then generated
     * for immediate use by the newly registered user.
     *
     * @param request the registration request containing user details
     * @return an authentication response containing the JWT token for the registered user
     */
    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    /**
     * Authenticates a user based on email and password. This method verifies user credentials
     * using the Spring Security authentication manager. If authentication is successful, a JWT token
     * is generated and returned.
     *
     * @param request the authentication request containing user credentials
     * @return an authentication response containing the JWT token for the authenticated user
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Assuming authentication was successful if no exception was thrown
        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .build();
    }
}