package com.wahab.backend.controller;


import com.wahab.backend.dto.UserDTO;
import com.wahab.backend.entity.User;
import com.wahab.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/v1/user")
public class UserController {

    private final UserService userService;

    @GetMapping("load-Principal")
    public UserDTO getCurrentUser(Principal principal){
        return userService.getPrincipalUser(principal);
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

}
