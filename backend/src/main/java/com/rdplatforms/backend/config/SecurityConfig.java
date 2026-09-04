package com.rdplatforms.backend.config;

import com.rdplatforms.backend.auth.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Stateless JWT auth (see JwtService/JwtAuthenticationFilter) — no
 * sessions, no CSRF (there's nothing session-cookie-based to protect
 * against). GET on the public content endpoints (/businesses/**) and
 * POST /auth/login stay open; everything else requires a valid token —
 * note this is GET-only on /businesses/**, not the whole path prefix:
 * TASK-009 adds POST/PATCH endpoints under the same /businesses/** path
 * for Super Admin actions (create/suspend a tenant, create its first
 * owner), which must NOT be publicly accessible. Fine-grained
 * authorization beyond "has a valid token" (e.g. "is this specifically
 * a Super Admin") is each controller's own job, checked against
 * AuthenticatedUser — Spring's authenticated() here only proves a valid
 * token exists, not which one.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter)
            throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth ->
                                auth.requestMatchers("/actuator/**", "/auth/login")
                                        .permitAll()
                                        .requestMatchers(HttpMethod.GET, "/businesses/**")
                                        .permitAll()
                                        .anyRequest()
                                        .authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
