package com.wahab.backend.service;

import com.wahab.backend.dto.ProjectDTO;
import com.wahab.backend.dto.ProjectMapper;
import com.wahab.backend.entity.Project;
import com.wahab.backend.entity.Ticket;
import com.wahab.backend.entity.User;
import com.wahab.backend.repository.ProjectRepository;
import com.wahab.backend.repository.TicketRepository;
import com.wahab.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service implementation for managing projects.
 */
@Service
@AllArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TicketRepository ticketRepository;
    private final ProjectMapper projectMapper;

    /**
     * Creates a new project based on the provided DTO and assigns users to it.
     * @param projectDTO the project data transfer object containing the project details
     * @return the created project as a DTO
     */
    @Override
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Project project = Project.builder()
                .title(projectDTO.title())
                .build();

        Set<User> setInitialUsers = new HashSet<>(userRepository.findAllById(projectDTO.userIds()));

        project.setUsers(setInitialUsers);
        setInitialUsers.forEach(user -> user.getProjects().add(project));

        projectRepository.save(project);
        userRepository.saveAll(setInitialUsers);

        return projectMapper.apply(project);
    }

    /**
     * Retrieves all projects associated with the requesting user.
     * @param principal the security principal of the requesting user
     * @return a list of project DTOs
     */
    @Override
    public List<ProjectDTO> getUserProjects(Principal principal) {
        User user = userService.findUserById(userService.getPrincipalUser(principal).id());
        return user.getProjects()
                .stream()
                .map(projectMapper)
                .collect(Collectors.toList());
    }

    /**
     * Finds a specific project by its ID.
     * @param projectId the ID of the project to find
     * @return the found project as a DTO
     */
    @Override
    public ProjectDTO findProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id " + projectId));
        return projectMapper.apply(project);
    }

    /**
     * Updates a project based on the provided DTO.
     * @param projectDTO the project DTO containing the updated details
     * @return the updated project as a DTO
     */
    @Override
    public ProjectDTO updateProject(ProjectDTO projectDTO) {
        Project existingProject = projectRepository.findById(projectDTO.id())
                .orElseThrow(() -> new EntityNotFoundException("Project with ID " + projectDTO.id() + " not found"));

        updateUsers(existingProject, new HashSet<>(userRepository.findAllById(projectDTO.userIds())));
        updateTickets(existingProject, new HashSet<>(ticketRepository.findAllById(projectDTO.ticketIds())));

        existingProject.setTitle(projectDTO.title());
        existingProject.setLastUpdated(LocalDateTime.now());

        projectRepository.save(existingProject);
        return projectMapper.apply(existingProject);
    }

    /**
     * Deletes a project by its ID.
     * @param projectId the ID of the project to delete
     */
    @Override
    public void deleteProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project with ID " + projectId + " not found"));

        project.getUsers().forEach(user -> user.getProjects().remove(project));
        userRepository.saveAll(project.getUsers());
        projectRepository.delete(project);
    }

    private void updateUsers(Project project, Set<User> newUsers) {
        Set<User> currentUsers = project.getUsers();
        Set<User> usersToAdd = newUsers.stream().filter(user -> !currentUsers.contains(user)).collect(Collectors.toSet());
        Set<User> usersToRemove = currentUsers.stream().filter(user -> !newUsers.contains(user)).collect(Collectors.toSet());

        usersToAdd.forEach(user -> {
            user.getProjects().add(project);
            project.getUsers().add(user);
        });

        usersToRemove.forEach(user -> {
            user.getProjects().remove(project);
            project.getUsers().remove(user);
        });

        userRepository.saveAll(usersToAdd);
        userRepository.saveAll(usersToRemove);
    }

    private void updateTickets(Project project, Set<Ticket> newTickets) {
        Set<Ticket> currentTickets = project.getTickets();
        Set<Ticket> ticketsToAdd = newTickets.stream().filter(ticket -> !currentTickets.contains(ticket)).collect(Collectors.toSet());
        Set<Ticket> ticketsToRemove = currentTickets.stream().filter(ticket -> !newTickets.contains(ticket)).collect(Collectors.toSet());

        project.setTickets(newTickets);
        ticketRepository.saveAll(ticketsToAdd);
        ticketRepository.deleteAll(ticketsToRemove);
    }
}
