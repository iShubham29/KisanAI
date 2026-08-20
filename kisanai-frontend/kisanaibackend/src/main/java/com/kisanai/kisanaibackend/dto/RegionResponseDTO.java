package com.kisanai.kisanaibackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegionResponseDTO {

    private Integer id;      // Region ID from DB
    private String name;     // Region name — State/District/Taluka name
    private String code;     // Only for states — e.g. MH, GJ, UP (null for districts/talukas)
}