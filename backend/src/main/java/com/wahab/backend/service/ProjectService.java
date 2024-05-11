package com.wahab.backend.service;

import com.wahab.backend.dto.ProjectDTO;
import com.wahab.backend.entity.Project;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Principal;
import java.util.List;

public interface ProjectService {

    ProjectDTO createProject(Principal principal, @RequestBody ProjectDTO project);

    List<ProjectDTO> getUserProjects(Principal principal);

    ProjectDTO findProjectById(Long projectId);

    ProjectDTO updateProject(Long projectId,ProjectDTO projectDTO);

    void addUserToProject(Long projectId, Long userId);

    void removeTeamMember(Long projectId, Long userId);

    void removeAllUsers(Long projectId);

    void deleteProjectById(Long projectId);

}
