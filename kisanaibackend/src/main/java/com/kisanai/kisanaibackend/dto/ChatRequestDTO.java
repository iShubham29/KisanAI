package com.kisanai.kisanaibackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestDTO {

    private String state;       // Which state the farmer is in
    private String district;    // Which district
    private String taluka;      // Which taluka (optional)
    private String soilType;    // Soil type (optional)
    private String season;      // Kharif / Rabi / Zaid (optional)
    private String query;       // Farmer's actual question
}