package com.wahab.backend.dto;

import com.wahab.backend.entity.Ticket;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
public class TicketMapper implements Function<Ticket, TicketDTO> {

    @Override
    public TicketDTO apply(Ticket ticket) {

        Long userId = ticket.getAssignedUser().getId();
        Long projectId = ticket.getProject().getId();

        return new TicketDTO(
                ticket.getId(),
                ticket.getCreator(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getType(),
                ticket.getStatus(),
                userId,
                projectId
        );
    }
}
