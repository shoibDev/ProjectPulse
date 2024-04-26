package com.wahab.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity for managing projects with automatic timestamping for creation and updates.
 * Projects can have multiple users and can contain multiple tickets.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Project {

    @Id
    private Long id;

    private String name;

    @CreationTimestamp
    private LocalDateTime dateCreated;

    @UpdateTimestamp
    private LocalDateTime lastUpdated;

    @ManyToMany(mappedBy = "projects")
    private Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "project")
    private Set<Ticket> tickets = new HashSet<>();
}
