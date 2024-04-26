package com.wahab.backend.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data transfer object (DTO) representing a registration request.
 * This class is used to capture necessary user details for registration including
 * first name, last name, email, and password.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String password;

}
