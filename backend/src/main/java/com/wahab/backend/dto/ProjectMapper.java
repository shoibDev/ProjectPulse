package com.wahab.backend.dto;

import com.wahab.backend.entity.Project;
import com.wahab.backend.entity.Ticket;
import com.wahab.backend.entity.User;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class ProjectMapper implements Function<Project, ProjectDTO> {
    @Override
    public ProjectDTO apply(Project project) {

        List<Long> userIds = project.getUsers()
                .stream()
                .map(User::getId)
                .collect(Collectors.toList());

        List<Long> ticketIds = project.getTickets()
                .stream()
                .map(Ticket::getId)
                .collect(Collectors.toList());

        return new ProjectDTO(
                project.getId(),
                project.getTitle(),
                project.getDateCreated(),
                project.getLastUpdated(),
                userIds,
                ticketIds
        );
    }
}
