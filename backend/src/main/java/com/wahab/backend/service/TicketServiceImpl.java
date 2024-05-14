package com.wahab.backend.service;

import com.wahab.backend.dto.TicketDTO;
import com.wahab.backend.dto.TicketMapper;
import com.wahab.backend.entity.Project;
import com.wahab.backend.entity.Ticket;
import com.wahab.backend.entity.User;
import com.wahab.backend.repository.ProjectRepository;
import com.wahab.backend.repository.TicketRepository;
import com.wahab.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TicketServiceImpl implements TicketService{

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ProjectRepository projectRepository;
    private final TicketMapper ticketMapper;
    private final ProjectService projectService;

    @Override
    public TicketDTO createTicket(Principal principal, Long projectId, TicketDTO ticketDTO) {

        User user = userService.findUserById(
                        userRepository.findByEmail(
                            principal.getName()
                        ).orElseThrow(() -> new UsernameNotFoundException("User not found with email")
                ).getId());

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id " + projectId));


        Ticket ticket = Ticket.builder()
                .creator(user.getFirstName() + " " + user.getLastName())
                .title(ticketDTO.title())
                .description(ticketDTO.description())
                .priority(ticketDTO.priority())
                .type(ticketDTO.type())
                .status(ticketDTO.status())
                .project(project)
                .assignedUser(user)
                .build();

        user.getTickets().add(ticket);
        project.getTickets().add(ticket);

        userRepository.save(user);
        projectRepository.save(project);
        ticketRepository.save(ticket);

        return ticketMapper.apply(ticket);
    }

    @Override
    public Ticket findTicketById(Long ticketId) {
        return ticketRepository.getReferenceById(ticketId);
    }

    @Override
    public List<TicketDTO> getAllTickets(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(null);

        return user.getTickets()
                .stream()
                .map(ticketMapper)
                .collect(Collectors.toList());
    }

    @Override
    public TicketDTO updateTicket(Long ticketId, TicketDTO ticketDTO) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found with id " + ticketId));

        ticket.setTitle(ticketDTO.title());
        ticket.setDescription(ticketDTO.description());
        ticket.setPriority(ticketDTO.priority());
        ticket.setType(ticketDTO.type());
        ticket.setStatus(ticketDTO.status());
        ticket.setAssignedUser(null);

  /*      User assignedUser = userRepository.findById(ticketDTO.userId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + ticketDTO.userId()));
        ticket.setAssignedUser(assignedUser);*/

        ticketRepository.save(ticket);
        return ticketMapper.apply(ticket);
    }

    @Override
    public void deleteTicketById(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found with id " + ticketId));

        // Optional: Remove the ticket from the user's ticket list and project's ticket list if necessary
        User user = ticket.getAssignedUser();
        Project project = ticket.getProject();
        user.getTickets().remove(ticket);
        project.getTickets().remove(ticket);

        userRepository.save(user);
        projectRepository.save(project);

        ticketRepository.delete(ticket);
    }
}
