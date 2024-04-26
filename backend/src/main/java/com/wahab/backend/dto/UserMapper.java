package com.wahab.backend.dto;

import com.wahab.backend.entity.Project;
import com.wahab.backend.entity.Ticket;
import com.wahab.backend.entity.User;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class UserMapper implements Function<User, UserDTO>{
    @Override
    public UserDTO apply(User user) {

        List<Long> projectIds = user.getProjects()
                .stream()
                .map(Project::getId)
                .collect(Collectors.toList());

        // Extract ticket IDs using Java Stream API
        List<Long> ticketIds = user.getTickets()
                .stream()
                .map(Ticket::getId)
                .collect(Collectors.toList());

        return new UserDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole(),
                projectIds,
                ticketIds
        );
    }
}
