package com.wahab.backend.repository;

import com.wahab.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByEmailNot(String email);

//    @Query("SELECT u FROM User u WHERE u.id NOT IN (SELECT p.users FROM Project p WHERE p.id = :projectId)")
//    List<User> findAllByProjectIdNot(Long projectId);
}
