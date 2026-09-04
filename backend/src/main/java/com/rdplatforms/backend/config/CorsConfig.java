package com.rdplatforms.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * The public website (apps/website, a Vite dev server or a deployed
 * static site) calls this API from a different origin, so it needs
 * explicit CORS allowance — browsers block cross-origin requests by
 * default. Origins are configurable (app.cors.allowed-origins, comma-
 * separated) since the deployed frontend's real origin isn't known yet;
 * defaults to the Vite dev server port for local development.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins(allowedOrigins).allowedMethods("GET");
    }
}
