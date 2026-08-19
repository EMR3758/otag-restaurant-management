package com.emirhan.day3.springboot.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// Bu sınıf Spring Security ayarlarını yapar.
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Spring, JwtAuthenticationFilter Bean'ini buraya verir.
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // Spring Security'nin güvenlik kurallarını belirler.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                // REST API + JWT kullandığımız için CSRF'yi kapatıyoruz.
                .csrf(csrf -> csrf.disable())

                // React (localhost:5173) ile Spring Boot (localhost:8080)
                // farklı origin olduğu için CORS ayarlarını aktif ediyoruz.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Hangi endpoint'lere kim girebilir?
                .authorizeHttpRequests(auth -> auth

                        // Login sırasında henüz JWT token olmadığı için
                        // herkesin login endpoint'ine erişmesine izin veriyoruz.
                        .requestMatchers(
                                "/auth/login",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Spring Boot varsayılan olarak güvenlik filtresini
                        // /error forward'ında da çalıştırıyor.
                        // /error permitAll değilse, controller/service
                        // içinde oluşan gerçek hatalar (ör. 500) burada
                        // "authenticated değil" denilerek 403'e dönüşüyor
                        // ve asıl hatayı gizliyor. Bu yüzden /error'u
                        // herkese açık bırakıyoruz.
                        .requestMatchers("/error").permitAll()

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Personel (User) yönetimi yetkilendirmesi:
                        // - Listeyi ADMIN, MANAGER ve CHEF görebilir.
                        // - Personel ekleme/güncelleme/silme sadece ADMIN ve MANAGER'a açık.
                        // - MANAGER'ın ADMIN hesaplarını düzenleyip silememesi (hiyerarşi
                        //   kuralı) UserService içinde, hedef kullanıcının rolüne bakılarak
                        //   ayrıca kontrol ediliyor (bu path bazlı kural bunu ayırt edemez).
                        .requestMatchers(HttpMethod.GET, "/users", "/users/**")
                                .hasAnyRole("ADMIN", "MANAGER", "CHEF")
                        .requestMatchers(HttpMethod.POST, "/users")
                                .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/users/**")
                                .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/users/**")
                                .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.DELETE, "/orders/**").permitAll()
                        .requestMatchers("/tables/**").permitAll()
                        .requestMatchers("/orders/**").permitAll()
                        .requestMatchers("/products/**").permitAll()
                        // Yukarıdakiler dışındaki bütün endpointler
                        // authentication (JWT) gerektirir.
                        .anyRequest().authenticated()
                )

                // JWT Filter'ımız UsernamePasswordAuthenticationFilter'dan
                // önce çalışacak.
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // Kullanıcı şifrelerini güvenli şekilde hashlemek için BCrypt kullanıyoruz.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Login sırasında kullanıcının email ve şifresini
    // Spring Security üzerinden doğrulamak için AuthenticationManager kullanıyoruz.
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }

    // React frontend ile Spring Boot backend arasındaki
    // cross-origin (farklı port) isteklerine izin veren CORS ayarları.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Sadece bizim React uygulamamızdan gelen isteklere izin veriyoruz.
        // React:  http://localhost:5173
        // Spring: http://localhost:8080
        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        // Frontend'in kullanabileceği HTTP metodlarını belirliyoruz.
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        // İsteklerdeki header'lara izin veriyoruz.
        // "*" bütün header'lara izin verilmesi anlamına gelir.
        // Örneğin ileride JWT gönderirken Authorization header'ını kullanacağız.
        configuration.setAllowedHeaders(
                List.of("*")
        );

        // Cross-origin isteklerde credentials kullanımına izin veriyoruz.
        configuration.setAllowCredentials(true);

        // CORS ayarlarını Spring'in anlayacağı kaynak haline getiriyoruz.
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        // /** = bütün endpointler için bu CORS ayarlarını kullan.
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}