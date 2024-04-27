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
     * @param principal the security principal of the requesting user
     * @param projectDTO the project data transfer object containing the project details
     * @return the created project as a DTO
     */
    @Override
    public ProjectDTO createProject(Principal principal, ProjectDTO projectDTO) {
        Project project = Project.builder()
                .title(projectDTO.title())
                .build();

        Set<User> assignedUsers = new HashSet<>(userRepository.findAllById(projectDTO.userIds()));

        if (!projectDTO.userIds().isEmpty()) {
            for (User user : assignedUsers) {
                project.getUsers().add(user);
                user.getProjects().add(project);
            }
        }
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

        Set<User> users = new HashSet<>(userRepository.findAllById(projectDTO.userIds()));
        Set<Ticket> tickets = new HashSet<>(ticketRepository.findAllById(projectDTO.ticketIds()));

        // Update project properties
        existingProject.setTitle(projectDTO.title());
        existingProject.setLastUpdated(LocalDateTime.now());

        if (!projectDTO.userIds().isEmpty()) {
            existingProject.setUsers(users);
        }
        if (!projectDTO.ticketIds().isEmpty()) {
            existingProject.setTickets(tickets);
        }

        // Save the updated project
        projectRepository.save(existingProject);

        return projectMapper.apply(existingProject);
    }

    /**
     * Deletes a project by its ID.
     * @param projectId the ID of the project to delete
     */
    @Transactional
    @Override
    public void deleteProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project with ID " + projectId + " not found"));

        // Remove the project from each associated user's list of projects
        project.getUsers().forEach(user -> user.getProjects().remove(project));
        userRepository.saveAll(project.getUsers());

        // Delete the project
        projectRepository.delete(project);
    }
}
