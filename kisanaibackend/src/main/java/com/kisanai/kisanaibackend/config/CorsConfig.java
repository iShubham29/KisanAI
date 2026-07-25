package com.kisanai.kisanaibackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration                          // Spring reads this at startup as a config class
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")          // Apply CORS to all /api/* endpoints
                .allowedOrigins("*")            // Allow all origins — change to frontend URL in production
                .allowedMethods("GET", "POST")  // Only allow GET and POST
                .allowedHeaders("*");           // Allow all headers
    }
}