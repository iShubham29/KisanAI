package com.kisanai.kisanaibackend.controller;

import com.kisanai.kisanaibackend.dto.RegionResponseDTO;
import com.kisanai.kisanaibackend.service.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController                         // REST API — returns JSON automatically
@RequestMapping("/api/regions")         // Base URL for all endpoints in this controller
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;  // Injected — DI via constructor

    @GetMapping("/states")                      // GET /api/regions/states
    public ResponseEntity<List<RegionResponseDTO>> getAllStates() {
        return ResponseEntity.ok(regionService.getAllStates());
    }

    @GetMapping("/districts/{stateCode}")       // GET /api/regions/districts/MH
    public ResponseEntity<List<RegionResponseDTO>> getDistricts(@PathVariable String stateCode) {
        return ResponseEntity.ok(regionService.getDistrictsByState(stateCode));
    }

    @GetMapping("/talukas/{districtId}")        // GET /api/regions/talukas/123
    public ResponseEntity<List<RegionResponseDTO>> getTalukas(@PathVariable Integer districtId) {
        return ResponseEntity.ok(regionService.getTalukasByDistrict(districtId));
    }
}