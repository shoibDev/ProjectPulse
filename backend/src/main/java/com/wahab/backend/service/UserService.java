package com.wahab.backend.service;

import com.wahab.backend.dto.UserDTO;
import com.wahab.backend.entity.User;

import java.security.Principal;
import java.util.List;

public interface UserService{

    User findUserById(Long userId);

    UserDTO getUserById(Long userId);

    UserDTO getPrincipalUser(Principal principal);

    List<UserDTO> getAllUsers();

    void updateUserInfo(Long userId, User user);

    void deleteUser(Long userId);

    User DTOToEntity(Long userId, User user);

    //List<UserDTO> getUsersExcludingProject(Long projectId);

}
