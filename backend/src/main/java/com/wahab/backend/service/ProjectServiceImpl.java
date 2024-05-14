package com.wahab.backend.service;

import com.wahab.backend.dto.ProjectDTO;
import com.wahab.backend.dto.ProjectMapper;
import com.wahab.backend.dto.UserDTO;
import com.wahab.backend.dto.UserMapper;
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
    private final UserMapper userMapper;

    /**
     * Creates a new project based on the provided DTO and assigns users to it.
     * @param projectDTO the project data transfer object containing the project details
     * @return the created project as a DTO
     */
    @Override
    public ProjectDTO createProject(Principal principal, ProjectDTO projectDTO) {
        Project project = Project.builder()
                .title(projectDTO.title())
                .description(projectDTO.description())
                .build();

        User principalUser = userService.findUserById(userService.getPrincipalUser(principal).id());
        principalUser.getProjects().add(project);

        projectRepository.save(project);
        userRepository.save(principalUser);

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
    public ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO) {
        Project existingProject = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project with ID " + projectDTO.id() + " not found"));

        existingProject.setTitle(projectDTO.title());
        existingProject.setDescription(projectDTO.description());
        existingProject.setLastUpdated(LocalDateTime.now());

        projectRepository.save(existingProject);
        return projectMapper.apply(existingProject);
    }

    @Override
    public List<UserDTO> getNoneProjectUsers(Long projectId) {
        List<User> userDTO =  userService.retrieveAllUsers().stream().filter(user -> user.getProjects().stream().noneMatch(project -> project.getId().equals(projectId)))
                .collect(Collectors.toList());

        return userDTO.stream().map(userMapper).collect(Collectors.toList());
    }

    @Override
    public void addUserToProject(Long projectId, Long userId) {
        Project project = projectRepository.getReferenceById(projectId);
        User user = userRepository.findById(userId).orElseThrow();

        project.getUsers().add(user);
        user.getProjects().add(project);

        projectRepository.save(project);
        userRepository.save(user);
    }

    @Override
    public void removeTeamMember(Long projectId, Long userId) {
        Project project = projectRepository.getReferenceById(projectId);
        User user = userRepository.findById(userId).orElseThrow();

        project.getUsers().remove(user);
        user.getProjects().remove(project);

        projectRepository.save(project);
        userRepository.save(user);
    }

    @Override
    public void removeAllUsers(Long projectId) {
        // Fetch the project with all associated users
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project with ID " + projectId + " not found"));

        // Iterate over the users and remove the project from each user's project set
        Set<User> users = project.getUsers();
        users.forEach(user -> user.getProjects().remove(project));

        // Clear the project's user set
        project.getUsers().clear();

        // Save changes in the database
        userRepository.saveAll(users); // Saves all users with the updated project list
        projectRepository.save(project); // Save the project with the updated user list
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

}
