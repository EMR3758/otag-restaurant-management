package com.emirhan.day3.springboot.security;

import com.emirhan.day3.springboot.model.User;
import com.emirhan.day3.springboot.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service // Spring bu sınıfı oluşturur ve yönetir.
public class CustomUserDetailsService implements UserDetailsService {

    // Veritabanındaki kullanıcıları bulmak için Repository
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // Login sırasında girilen email ile kullanıcıyı bul.
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Bulunan kullanıcıyı Spring Security'nin anlayacağı UserDetails nesnesine çevir.
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())      // Kullanıcı adı (biz email kullanıyoruz)
                .password(user.getPassword())       // Şifre (encode edilmiş)
                .roles(user.getRole().name())       // Kullanıcının rolü (ADMIN, USER...)
                .build();                           // UserDetails nesnesini oluştur
    }
}