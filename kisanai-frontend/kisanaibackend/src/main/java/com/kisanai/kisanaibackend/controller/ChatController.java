package com.kisanai.kisanaibackend.controller;

import com.kisanai.kisanaibackend.dto.ChatRequestDTO;
import com.kisanai.kisanaibackend.dto.ChatResponseDTO;
import com.kisanai.kisanaibackend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")            // Base URL for chat endpoints
@RequiredArgsConstructor
public class ChatController {

    private final GeminiService geminiService;  // Injected — calls Gemini API

    @PostMapping                                // POST /api/chat
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request) {

        if (request.getQuery() == null || request.getQuery().isBlank()) {
            return ResponseEntity.badRequest().build();  // 400 — query is mandatory
        }
        if (request.getState() == null || request.getState().isBlank()) {
            return ResponseEntity.badRequest().build();  // 400 — state is mandatory
        }

        ChatResponseDTO response = geminiService.chat(request);
        return ResponseEntity.ok(response);             // 200 — success
    }
}