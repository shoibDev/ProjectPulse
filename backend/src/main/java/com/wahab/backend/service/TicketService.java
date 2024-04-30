package com.wahab.backend.service;

import com.wahab.backend.dto.TicketDTO;
import com.wahab.backend.entity.Ticket;

import java.util.List;

public interface TicketService {

    TicketDTO createTicket(TicketDTO ticketDTO);

    Ticket findTicketById(Long ticketId);

    List<TicketDTO> retrieveAllTickets();

    Ticket updateTicket(Ticket ticket);

    void deleteTicketById(Integer ticketId);

    TicketDTO requestBodyTicketToEntity(Long ticketId, Ticket ticket);


}
