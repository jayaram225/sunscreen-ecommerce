//SecurityConfig

package com.sunscreen.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;


@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(
                        org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()



                        // ✅ ALWAYS FIRST — allow static content
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login.html",
                                "/register.html",
                                "/**/*.html",
                                "/**/*.js",
                                "/**/*.css",
                                "/**/*.png",
                                "/**/*.jpg",
                                "/**/*.jpeg",
                                "/favicon.ico"
                        ).permitAll()



                        //  PUBLIC API
                        .requestMatchers("/login","/register", "/products/**", "/images/**","/config").permitAll()
                        //  ADMIN ONLY
                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
                        //  AUTH REQUIRED
                        .requestMatchers("/payment/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {

            org.springframework.web.cors.CorsConfiguration config =
                    new org.springframework.web.cors.CorsConfiguration();

           // config.setAllowedOrigins(List.of("http://localhost:63342"));
            config.setAllowedOrigins(List.of("http://localhost:8080"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("*"));
            config.setAllowCredentials(true);

            org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
                    new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

            source.registerCorsConfiguration("/**", config);

            return source;
        }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    }


