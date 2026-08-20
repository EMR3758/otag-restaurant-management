package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.AuthResponse;
import com.emirhan.day3.springboot.dto.LoginRequest;
import com.emirhan.day3.springboot.model.User;
import com.emirhan.day3.springboot.repository.UserRepository;
import com.emirhan.day3.springboot.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService,
                          JwtService jwtService,
                          UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(request.getEmail());

        String token = jwtService.generateToken(userDetails);

        // "ROLE_ADMIN" gibi Spring Security authority'sinden başındaki
        // "ROLE_" önekini çıkarıp frontend'e düz enum değeri ("ADMIN") olarak veriyoruz.
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .orElse(null);

        //Setting.jsx kısmında "MUDUR","WAITER" felan bulması için
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        Long userId = user.getId();

        return new AuthResponse(token, role, userId);
    }

}