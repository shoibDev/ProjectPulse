package com.wahab.backend.controller;

import com.wahab.backend.dto.ProjectDTO;
import com.wahab.backend.dto.UserDTO;
import com.wahab.backend.dto.UserMapper;
import com.wahab.backend.entity.Project;
import com.wahab.backend.entity.User;
import com.wahab.backend.repository.ProjectRepository;
import com.wahab.backend.repository.UserRepository;
import com.wahab.backend.service.ProjectService;
import com.wahab.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/v1/project")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @PostMapping("/create-project")
    public ProjectDTO createProject(Principal principal, @RequestBody ProjectDTO projectDTO){
        return projectService.createProject(principal, projectDTO);
    }

    @PutMapping("/{projectId}/update-project")
    public ProjectDTO updateProject(@PathVariable("projectId") Long projectId, @RequestBody ProjectDTO projectDTO){
        return projectService.updateProject(projectId, projectDTO);
    }


    @GetMapping("/assigned-projects")
    public List<ProjectDTO> getAssignedProjects(Principal principal){
        return projectService.getUserProjects(principal);
    }

    @GetMapping("/{projectId}")
    public ProjectDTO getProjectById(@PathVariable("projectId") Long projectId) {
        return projectService.findProjectById(projectId);
    }



    @GetMapping("/{projectId}/add-team-member-form")
    public List<UserDTO> getAvailableUsers(@PathVariable("projectId") Long projectId){
        return projectService.getNoneProjectUsers(projectId);
    }


    @DeleteMapping("/{projectId}/delete")
    public void deleteProject(@PathVariable("projectId") Long projectId) {
        projectService.deleteProjectById(projectId);
    }

    @PutMapping("/{projectId}/user/{userId}")
    public void addTeamMember(@PathVariable("projectId") Long projectId,
                              @PathVariable("userId") Long userId
    ) {
        projectService.addUserToProject(projectId, userId);
    }

    @DeleteMapping("/{projectId}/user/{userId}")
    public void removeUser(@PathVariable("projectId") Long projectId, @PathVariable("userId") Long userId){
        projectService.removeTeamMember(projectId, userId);
    }


    @DeleteMapping("/{projectId}/users")
    public void removeAllTeamMembers(@PathVariable("projectId") Long projectId){
        projectService.removeAllUsers(projectId);
    }


    @GetMapping("/{projectId}/users")
    public List<UserDTO> getProjectDevs(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.getReferenceById(projectId);
        Set<User> projectUsers = project.getUsers();

        return projectUsers.stream()
                .map(userMapper)
                .collect(Collectors.toList());
    }

}
