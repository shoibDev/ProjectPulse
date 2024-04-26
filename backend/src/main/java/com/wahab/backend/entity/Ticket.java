package com.wahab.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity for managing tickets with unique titles and various attributes like priority and status.
 * Each ticket is associated with one project and can be assigned to one user.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Ticket {

    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    private String description;

    private String author;

    private String priority;

    private String type;

    private String status;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)  // nullable true if a ticket can be unassigned
    private User assignedUser;


}
