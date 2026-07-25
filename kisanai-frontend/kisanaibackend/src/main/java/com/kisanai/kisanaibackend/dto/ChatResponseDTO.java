package com.kisanai.kisanaibackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDTO {

    private String response;    // Gemini's AI generated answer
    private String state;       // Echoed back — state that was queried
    private String district;    // Echoed back — district that was queried
    private String taluka;      // Echoed back — taluka that was queried
}