package com.wahab.backend.service;

import com.wahab.backend.dto.UserDTO;
import com.wahab.backend.dto.UserMapper;
import com.wahab.backend.entity.User;
import com.wahab.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for user management.
 * Provides methods to manage user data and interact with the user repository.
 */
@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    /**
     * Finds a user by ID.
     *
     * @param userId the ID of the user to find.
     * @return the found user entity.
     * @throws UsernameNotFoundException if no user is found with the provided ID.
     */
    @Override
    public User findUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(
                () -> new UsernameNotFoundException("User not found with id: " + userId)
        );
    }

    /**
     * Retrieves a user by ID and converts it to a DTO.
     *
     * @param userId the ID of the user to retrieve.
     * @return the UserDTO representation of the user.
     * @throws UsernameNotFoundException if no user is found with the provided ID.
     */
    @Override
    public UserDTO getUserById(Long userId) {
        return userRepository.findById(userId)
                .map(userMapper).orElseThrow(
                        () -> new UsernameNotFoundException("User not found with id: " + userId)
                );
    }

    /**
     * Retrieves all users sorted by last name in ascending order.
     *
     * @return a list of UserDTOs representing all users.
     */
    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "lastName"))
                .stream()
                .map(userMapper)
                .collect(Collectors.toList());
    }

    /**
     * Saves or updates user information.
     *
     * @param userId the ID of the user to save or update.
     * @param user the user entity containing new or updated data.
     */
    public void saveUserInfo(Long userId, User user) {
        userRepository.save(requestBodyUserToEntity(userId, user));
    }

    /**
     * Removes a user by ID.
     *
     * @param userId the ID of the user to remove.
     */
    @Override
    public void removeUser(Long userId) {
        userRepository.delete(findUserById(userId));
    }

    /**
     * Converts and updates a user entity from a given user DTO.
     *
     * @param userId the ID of the user to update.
     * @param user the DTO containing updated user data.
     * @return the updated user entity.
     */
    @Override
    public User requestBodyUserToEntity(Long userId, User user) {
        User entity = findUserById(userId);

        entity.setFirstName(user.getFirstName());
        entity.setLastName(user.getLastName());
        entity.setEmail(user.getEmail());
        entity.setPhoneNumber(user.getPhoneNumber());
        entity.setRole(user.getRole());

        return entity;
    }
}
