package com.wahab.backend.service;

import com.wahab.backend.dto.TicketDTO;
import com.wahab.backend.dto.TicketMapper;
import com.wahab.backend.entity.Ticket;
import com.wahab.backend.repository.TicketRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TicketServiceImpl implements TicketService{

    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final ProjectService projectService;

    @Override
    public TicketDTO createTicket(Ticket ticket) {



        return null;
    }

    @Override
    public Ticket findTicketById(Long ticketId) {
        return ticketRepository.getReferenceById(ticketId);
    }

    @Override
    public List<TicketDTO> retrieveAllTickets() {
        return null;
    }

    @Override
    public Ticket updateTicket(Ticket ticket) {
        return null;
    }

    @Override
    public void deleteTicketById(Integer ticketId) {

    }

    @Override
    public TicketDTO requestBodyTicketToEntity(Long ticketId, Ticket ticket) {
        return null;
    }


}
