package com.wahab.backend.controller;

import com.wahab.backend.dto.TicketDTO;
import com.wahab.backend.dto.TicketMapper;
import com.wahab.backend.entity.Ticket;
import com.wahab.backend.repository.TicketRepository;
import com.wahab.backend.service.TicketService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping(path = "api/v1/ticket")
public class TicketController {

    private final TicketService ticketService;
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    @PostMapping
    public TicketDTO createTicket(Principal principal, @RequestParam Long projectId, @RequestBody TicketDTO ticketDTO) {
        return ticketService.createTicket(principal, projectId, ticketDTO);
    }

    @GetMapping("/{ticketId}")
    public TicketDTO getTicketById(@PathVariable Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));
        return ticketMapper.apply(ticket);
    }

    @GetMapping
    public List<TicketDTO> getAllTickets(Principal principal) {
        return ticketService.getAllTickets(principal);
    }

    @PutMapping("/{ticketId}")
    public TicketDTO updateTicket(@PathVariable Long ticketId, @RequestBody TicketDTO ticketDTO) {
        return ticketService.updateTicket(ticketId, ticketDTO);
    }

    @DeleteMapping("/{ticketId}")
    public void deleteTicketById(@PathVariable Long ticketId) {
        ticketService.deleteTicketById(ticketId);
    }
}
