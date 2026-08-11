package com.emirhan.day3.springboot.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    // JWT'yi imzalamak için kullanılan gizli anahtar.
    // Gerçek projede application.properties veya environment variable içinde tutulur.
    private final SecretKey SECRET_KEY =
            Keys.hmacShaKeyFor(
                    "mysecretkeymysecretkeymysecretkeymysecretkey"
                            .getBytes(StandardCharsets.UTF_8)
            );

    // Login olan kullanıcı için JWT Token üretir.
    public String generateToken(UserDetails userDetails) {

        return Jwts.builder()
                .subject(userDetails.getUsername())   // Email
                .issuedAt(new Date())                 // Oluşturulma zamanı
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 saat
                .signWith(SECRET_KEY)                 // İmzala
                .compact();                           // Token'ı String olarak döndür
    }

    // Token içindeki tüm claim'leri (subject, issuedAt, expiration...) çözer.
    // İmza geçersizse veya token süresi dolmuşsa burada exception fırlar.
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Token'dan subject'i (bizim durumumuzda email) çıkarır.
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Token'ın son kullanma tarihini geçip geçmediğini kontrol eder.
    private boolean isTokenExpired(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    // Token hem doğru kullanıcıya ait hem de süresi dolmamışsa geçerlidir.
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}