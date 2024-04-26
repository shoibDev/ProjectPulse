package com.wahab.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectDTO(
        Long id,
        String name,
        LocalDateTime dateCreated,
        LocalDateTime lastUpdated,
        List<Long> userIds,
        List<Long> ticketIds
) {}