package com.wahab.backend.dto;

public record TicketDTO(
        Long id,
        String title,
        String description,
        String status,
        String priority,
        Long projectId,
        Long userId
) {}