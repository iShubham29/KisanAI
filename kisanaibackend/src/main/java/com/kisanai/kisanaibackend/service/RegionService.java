package com.kisanai.kisanaibackend.service;

import com.kisanai.kisanaibackend.dto.RegionResponseDTO;
import com.kisanai.kisanaibackend.repository.DistrictRepository;
import com.kisanai.kisanaibackend.repository.StateRepository;
import com.kisanai.kisanaibackend.repository.TalukaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service                        // Spring Bean — Service Layer
@RequiredArgsConstructor        // Lombok — generates constructor for final fields (Dependency Injection)
public class RegionService {

    private final StateRepository stateRepository;        // Injected via constructor
    private final DistrictRepository districtRepository;
    private final TalukaRepository talukaRepository;
    private final DataLoaderService dataLoaderService;

    public List<RegionResponseDTO> getAllStates() {
        dataLoaderService.awaitLoaded(60);                // Wait up to 60s for async data load
        return stateRepository.findAll()                  // Fetch all states from DB
                .stream()                                 // Stream API — functional style
                .map(state -> RegionResponseDTO.builder() // Map Entity → DTO
                        .id(state.getId())
                        .name(state.getName())
                        .code(state.getCode())
                        .build())
                .collect(Collectors.toList());            // Convert stream back to List
    }

    public List<RegionResponseDTO> getDistrictsByState(String stateCode) {
        return districtRepository.findByStateCode(stateCode)  // Custom query method
                .stream()
                .map(district -> RegionResponseDTO.builder()
                        .id(district.getId())
                        .name(district.getName())
                        .build())
                .collect(Collectors.toList());
    }

    public List<RegionResponseDTO> getTalukasByDistrict(Integer districtId) {
        return talukaRepository.findByDistrictId(districtId)  // Custom query method
                .stream()
                .map(taluka -> RegionResponseDTO.builder()
                        .id(taluka.getId())
                        .name(taluka.getName())
                        .build())
                .collect(Collectors.toList());
    }
}