package com.rdplatforms.backend.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * The public website and admin console (apps/website, apps/admin — a
 * Vite dev server or a deployed static site) call this API from a
 * different origin, so it needs explicit CORS allowance — browsers block
 * cross-origin requests by default. Origins are configurable
 * (app.cors.allowed-origins, comma-separated) since the deployed
 * frontends' real origins aren't known yet; defaults to both apps' Vite
 * dev server ports (5173 website, 5174 admin) for local development.
 *
 * A CorsConfigurationSource bean, not a WebMvcConfigurer, because
 * Spring Security's filter chain runs before MVC dispatch — it needs
 * .cors(Customizer.withDefaults()) in SecurityConfig to find this bean
 * and honor it, which a WebMvcConfigurer-based config is invisible to.
 */
@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:5174}")
    private String[] allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(List.of("GET", "POST"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
