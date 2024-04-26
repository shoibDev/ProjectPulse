package com.wahab.backend.service;

import com.wahab.backend.dto.UserDTO;
import com.wahab.backend.entity.User;

import java.util.List;

public interface UserService{

    User findUserById(Long userId);

    UserDTO getUserById(Long userId);

    List<UserDTO> getAllUsers();

    void saveUserInfo(Long userId, User user);

    void removeUser(Long userId);

    User requestBodyUserToEntity(Long userId, User user);

}
