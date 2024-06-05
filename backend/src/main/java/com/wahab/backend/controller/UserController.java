package com.wahab.backend.controller;


import com.wahab.backend.dto.UserDTO;
import com.wahab.backend.dto.UserMapper;
import com.wahab.backend.entity.User;
import com.wahab.backend.repository.UserRepository;
import com.wahab.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/v1/user")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @GetMapping("load-Principal")
    public UserDTO getCurrentUser(Principal principal){
        return userService.getPrincipalUser(principal);
    }

    @GetMapping("{userId}")
    public UserDTO getUserById(@PathVariable("userId") Long userId){
        return userService.getUserById(userId);
    }

    @GetMapping("/get-all-users")
    public List<UserDTO> getAllUsers(){
        return userService.getAllUsers();
    }

    @PutMapping(path = "/{userId}/edit-user")
    public void put(@PathVariable("userId") Long userId,
                    @RequestBody User user) {
        userService.updateUserInfo(userId, user);
    }

    @DeleteMapping(path = "/{userId}/delete-user")
    public void delete(@PathVariable("userId") Long userId){
        userService.deleteUser(userId);
    }

    @GetMapping("/exclude-current")
    public List<UserDTO> findAllUsersExceptCurrent(Principal principal) {
        String currentUserEmail = principal.getName();
        return userService.getAllUsers()
                .stream()
                .filter(userDTO -> !userDTO.email().equals(currentUserEmail))
                .collect(Collectors.toList());
    }

}