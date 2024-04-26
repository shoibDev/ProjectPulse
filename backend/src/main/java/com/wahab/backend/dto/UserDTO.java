package com.wahab.backend.dto;

import com.wahab.backend.security.Role;

import java.util.List;


public record UserDTO (
    Long id,
    String firstName,
    String lastName,
    String email,
    String phoneNumber,
    Role role,
    List<Long> projectId,
    List<Long> ticketId
){}
