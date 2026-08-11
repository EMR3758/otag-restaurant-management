package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.UserCreateDTO;
import com.emirhan.day3.springboot.dto.UserDTO;
import com.emirhan.day3.springboot.model.User;
import com.emirhan.day3.springboot.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO convertToDTO(User user){
        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }

    private User convertToUser(UserCreateDTO dto){
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setFullName(dto.getFullName());
        user.setRole(dto.getRole());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return  user;
    }

    public List<UserDTO> getAll(){
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOList = new ArrayList<>();

        for (User user:users){
            UserDTO userDTO = convertToDTO(user);
            userDTOList.add(userDTO);
        }
        return userDTOList;

    }

    public UserDTO create(UserCreateDTO dto){
        User user = convertToUser(dto);
        User savedUser = userRepository.save(user);
        UserDTO userDTO = convertToDTO(savedUser);
        return userDTO;
    }
    public UserDTO getById(Long id){
        User user = userRepository.findById(id).orElseThrow();
        return convertToDTO(user);
    }
    public UserDTO update(Long id,UserCreateDTO dto){
        User user = userRepository.findById(id).orElseThrow();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);

    }

    public void delete(Long id){
        userRepository.deleteById(id);
    }
}
