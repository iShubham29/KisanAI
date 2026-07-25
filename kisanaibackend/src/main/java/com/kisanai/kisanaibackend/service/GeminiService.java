package com.kisanai.kisanaibackend.service;

import com.kisanai.kisanaibackend.dto.ChatRequestDTO;
import com.kisanai.kisanaibackend.dto.ChatResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor        // Constructor Injection
public class GeminiService {

    private final ChatClient chatClient;            // Spring AI — auto-configured via application.properties
    private final PromptBuilderService promptBuilderService;  // Injected — builds the prompt

    public ChatResponseDTO chat(ChatRequestDTO request) {

        String prompt = promptBuilderService.buildPrompt(request);  // Step 1 — Build prompt

        String aiResponse = chatClient.prompt()     // Step 2 — Call Gemini API
                .user(prompt)                       // Send prompt as user message
                .call()                             // Make the API call
                .content();                         // Extract text response

        /*
        Your Spring Boot App
                ↓
        chatClient.prompt().user(prompt).call()
                ↓
        HTTP POST → https://generativelanguage.googleapis.com/v1beta/openai/chat/completions
                ↓  (this URL is in your application.properties)
        Gemini receives your prompt
                ↓
        Gemini processes and generates response
                ↓
        HTTP Response comes back
                ↓
        .content() extracts just the text
                ↓
        stored in aiResponse
        * */

        return ChatResponseDTO.builder()            // Step 3 — Build response DTO
                .response(aiResponse)
                .state(request.getState())
                .district(request.getDistrict())
                .taluka(request.getTaluka())
                .build();
    }
}