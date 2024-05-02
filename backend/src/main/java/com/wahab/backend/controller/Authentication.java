package com.wahab.backend.controller;

import com.wahab.backend.auth.AuthenticationRequest;
import com.wahab.backend.auth.RegisterRequest;
import com.wahab.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import com.wahab.backend.auth.AuthenticationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for handling authentication-related requests such as user registration and login.
 * This controller handles endpoints for registering new users and authenticating existing users,
 * leveraging the AuthenticationService to process requests.
 */

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class Authentication {

    private final AuthenticationService service;


    /**
     * Endpoint for registering a new user. Accepts registration details and returns an authentication token.
     *
     * @param request the registration request containing the user's details
     * @return a response entity containing the authentication response with a JWT token
     */
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ){
        return ResponseEntity.ok(service.register(request));
    }

    /**
     * Endpoint for authenticating a user. Accepts login details and returns an authentication token.
     *
     * @param request the authentication request containing the user's details
     * @return a response entity containing the authentication response with a JWT token
     */
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(service.authenticate(request));
    }
}
