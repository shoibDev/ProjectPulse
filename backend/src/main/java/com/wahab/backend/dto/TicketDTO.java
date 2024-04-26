package com.wahab.backend.dto;

public record TicketDTO(
        Long id,
        String creator,
        String title,
        String description,
        String priority,
        String type,
        String status,
        Long userId,
        Long projectId
) {}