package com.kisanai.kisanaibackend.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//Spring AI 2.0.0 provides a ChatClient.Builder auto-configured from application.properties — but the actual ChatClient bean must be explicitly created.

@Configuration
public class ChatClientConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder.build();
    }
}