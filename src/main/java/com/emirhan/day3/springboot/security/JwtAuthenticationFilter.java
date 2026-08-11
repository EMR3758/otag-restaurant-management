package com.emirhan.day3.springboot.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/*
 * JWT Authentication Filter
 *
 * Her HTTP request geldiğinde çalışır.
 *
 * 1. Authorization header'ını alır.
 * 2. Bearer token'ı çıkarır.
 * 3. Token'dan username/email çıkarır.
 * 4. Kullanıcıyı DB'den bulur.
 * 5. Token'ın geçerli olup olmadığını kontrol eder.
 * 6. Geçerliyse kullanıcıyı SecurityContext'e koyar.
 */

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        /*
         * Authorization header'ını alıyoruz.
         *
         * Örnek:
         *
         * Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
         */

        final String authHeader =
                request.getHeader("Authorization");


        /*
         * Header yoksa veya Bearer ile başlamıyorsa
         * JWT kontrolü yapmıyoruz.
         */

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }


        /*
         * "Bearer " kısmını çıkarıyoruz.
         */

        final String token =
                authHeader.substring(7);


        /*
         * Token içerisinden username/email çıkarıyoruz.
         */

        final String username =
                jwtService.extractUsername(token);


        /*
         * Username bulunduysa ve SecurityContext'te
         * zaten authentication yoksa devam ediyoruz.
         */

        if (username != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {


            /*
             * Email ile DB'deki kullanıcıyı buluyoruz.
             */

            UserDetails userDetails =
                    userDetailsService
                            .loadUserByUsername(username);


            /*
             * Token'ın geçerli olup olmadığını kontrol ediyoruz.
             */

            boolean valid =
                    jwtService.isTokenValid(
                            token,
                            userDetails
                    );


            /*
             * GEÇİCİ DEBUG LOG'LARI
             *
             * Bunları birazdan 403 problemini bulmak için
             * Console'da kontrol edeceğiz.
             */

            System.out.println(
                    "JWT USERNAME: " + username
            );

            System.out.println(
                    "TOKEN VALID: " + valid
            );

            System.out.println(
                    "AUTHORITIES: " +
                            userDetails.getAuthorities()
            );


            /*
             * Token geçerliyse Authentication oluşturuyoruz.
             */

            if (valid) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );


                /*
                 * Request detaylarını ekliyoruz.
                 */

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );


                /*
                 * Kullanıcıyı SecurityContext'e koyuyoruz.
                 *
                 * Bundan sonra Spring Security:
                 *
                 * "Bu kullanıcı authenticated."
                 *
                 * diyebilir.
                 */

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authToken);
            }
        }


        /*
         * Request'i Filter Chain'in devamına gönderiyoruz.
         */

        filterChain.doFilter(request, response);
    }
}