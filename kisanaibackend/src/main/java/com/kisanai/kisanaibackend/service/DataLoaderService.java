package com.kisanai.kisanaibackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kisanai.kisanaibackend.model.District;
import com.kisanai.kisanaibackend.model.State;
import com.kisanai.kisanaibackend.repository.DistrictRepository;
import com.kisanai.kisanaibackend.repository.StateRepository;
import com.kisanai.kisanaibackend.repository.TalukaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.net.URL;

@Service
@RequiredArgsConstructor
public class DataLoaderService implements CommandLineRunner {

    private final StateRepository stateRepository;
    private final DistrictRepository districtRepository;
    private final TalukaRepository talukaRepository;

    private static final String DATA_API =
            "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries+states+cities.json";

    @Override
    public void run(String... args) throws Exception {

        if (stateRepository.count() > 0) return;

        ObjectMapper mapper = new ObjectMapper();
        JsonNode countriesArray = mapper.readTree(new URL(DATA_API));

        int districtId = 1;

        for (JsonNode countryNode : countriesArray) {
            if (!"India".equals(countryNode.get("name").asText())) continue;

            JsonNode statesArray = countryNode.get("states");
            if (statesArray == null) continue;

            for (JsonNode stateNode : statesArray) {
                if (stateNode.get("id") == null || stateNode.get("name") == null) continue;
                String stateCode = stateNode.get("iso2") != null && !stateNode.get("iso2").asText().isEmpty()
                        ? stateNode.get("iso2").asText()
                        : stateNode.get("state_code") != null ? stateNode.get("state_code").asText() : "";

                State state = State.builder()
                        .id(stateNode.get("id").asInt())
                        .name(stateNode.get("name").asText())
                        .code(stateCode)
                        .build();
                stateRepository.save(state);

                JsonNode citiesArray = stateNode.get("cities");
                if (citiesArray == null) continue;

                for (JsonNode cityNode : citiesArray) {
                    if (cityNode.get("name") == null) continue;
                    District district = District.builder()
                            .id(districtId++)
                            .name(cityNode.get("name").asText())
                            .stateCode(stateCode)
                            .build();
                    districtRepository.save(district);
                }
            }
            break;
        }
    }
}