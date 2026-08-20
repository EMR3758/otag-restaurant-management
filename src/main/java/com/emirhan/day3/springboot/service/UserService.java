package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.UserCreateDTO;
import com.emirhan.day3.springboot.dto.UserDTO;
import com.emirhan.day3.springboot.model.Role;
import com.emirhan.day3.springboot.model.User;
import com.emirhan.day3.springboot.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
                user.getRole(),
                user.isActive(),
                user.getPhone()
        );
    }

    // Şu an istek yapan kullanıcı ADMIN mi? (SecurityConfig zaten bu endpoint'lere
    // sadece ADMIN/MANAGER'ın girebileceğini garanti ediyor; burada sadece
    // ADMIN ile MANAGER'ı birbirinden ayırt ediyoruz.)
    private boolean isCurrentUserAdmin(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null){
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }

    private User convertToUser(UserCreateDTO dto){
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setFullName(dto.getFullName());
        user.setRole(dto.getRole());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setActive(dto.isActive());
        user.setPhone(dto.getPhone());
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

        // MANAGER, ADMIN rolünde yeni bir kullanıcı oluşturamaz
        // (aksi halde ADMIN'i düzenleyememe kuralını yeni bir ADMIN
        // hesabı yaratarak dolanabilirdi).
        if (dto.getRole() == Role.ADMIN && !isCurrentUserAdmin()){
            throw new AccessDeniedException("MANAGER, ADMIN rolünde kullanıcı oluşturamaz.");
        }

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

        // MANAGER, ADMIN hesaplarını düzenleyemez; sadece ADMIN bunu yapabilir.
        if (user.getRole() == Role.ADMIN && !isCurrentUserAdmin()){
            throw new AccessDeniedException("MANAGER, ADMIN hesaplarını düzenleyemez.");
        }

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        // Şifre alanı boş/eksik gönderildiyse (ör. EditUser.jsx formunda şifre
        // alanı hiç yok) mevcut şifre hash'ini olduğu gibi koruyoruz; aksi halde
        // null/boş şifre gerçek hash'in üzerine yazılıp kullanıcının girişini
        // kilitliyordu. Gerçekten yeni bir şifre girildiyse create() ile tutarlı
        // şekilde BCrypt ile encode ediyoruz.
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        user.setRole(dto.getRole());
        user.setActive(dto.isActive());
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);

    }

    public void delete(Long id){
        User user = userRepository.findById(id).orElseThrow();

        // MANAGER, ADMIN hesaplarını silemez; sadece ADMIN bunu yapabilir.
        if (user.getRole() == Role.ADMIN && !isCurrentUserAdmin()){
            throw new AccessDeniedException("MANAGER, ADMIN hesaplarını silemez.");
        }

        userRepository.deleteById(id);
    }
}
