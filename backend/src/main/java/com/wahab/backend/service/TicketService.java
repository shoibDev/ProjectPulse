package com.wahab.backend.service;

import com.wahab.backend.dto.TicketDTO;
import com.wahab.backend.entity.Ticket;

import java.security.Principal;
import java.util.List;

public interface TicketService {

    TicketDTO createTicket(Principal principal, Long projectId, TicketDTO ticketDTO);

    Ticket findTicketById(Long ticketId);

    List<TicketDTO> getAllTickets(Principal principal);

    TicketDTO updateTicket(Long ticketId, TicketDTO ticketDTO);

    void deleteTicketById(Long ticketId);


}
