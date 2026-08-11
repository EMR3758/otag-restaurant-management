package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.UserCreateDTO;
import com.emirhan.day3.springboot.dto.UserDTO;
import com.emirhan.day3.springboot.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAll();
    }

    @PostMapping
    public UserDTO createUser(@RequestBody UserCreateDTO dto) {
        return userService.create(dto);
    }

    @GetMapping("/{id}")
    public UserDTO getByIdUser(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Long id,
                              @RequestBody UserCreateDTO dto) {
        return userService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}