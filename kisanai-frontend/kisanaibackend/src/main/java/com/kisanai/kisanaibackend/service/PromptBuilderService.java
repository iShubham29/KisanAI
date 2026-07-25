package com.kisanai.kisanaibackend.service;

import com.kisanai.kisanaibackend.dto.ChatRequestDTO;
import org.springframework.stereotype.Service;

@Service
public class PromptBuilderService {

    public String buildPrompt(ChatRequestDTO request) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("You are KisanAI, an expert agricultural assistant for Indian farmers.\n\n");
        prompt.append("Farmer's Location:\n");
        prompt.append("- State: ").append(request.getState()).append("\n");
        prompt.append("- District: ").append(request.getDistrict()).append("\n");

        if (request.getTaluka() != null && !request.getTaluka().isBlank()) {
            prompt.append("- Taluka: ").append(request.getTaluka()).append("\n");
        }
        if (request.getSoilType() != null && !request.getSoilType().isBlank()) {
            prompt.append("- Soil Type: ").append(request.getSoilType()).append("\n");
        }
        if (request.getSeason() != null && !request.getSeason().isBlank()) {
            prompt.append("- Season: ").append(request.getSeason()).append("\n");
        }

        prompt.append("\nBased on this region's typical climate, rainfall, and soil conditions, ");
        prompt.append("please answer the following farmer's question:\n\n");
        prompt.append("Question: ").append(request.getQuery()).append("\n\n");
        prompt.append("Provide a practical, detailed answer in simple language suitable for a farmer.");

        return prompt.toString();
    }
}