package com.kisanai.kisanaibackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kisanai.kisanaibackend.model.District;
import com.kisanai.kisanaibackend.model.State;
import com.kisanai.kisanaibackend.repository.DistrictRepository;
import com.kisanai.kisanaibackend.repository.StateRepository;
import com.kisanai.kisanaibackend.repository.TalukaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataLoaderService implements CommandLineRunner {

    private final StateRepository stateRepository;
    private final DistrictRepository districtRepository;
    private final TalukaRepository talukaRepository;

    private static final String DATA_API =
            "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries+states+cities.json";

    private final AtomicBoolean loaded = new AtomicBoolean(false);
    private final AtomicBoolean loading = new AtomicBoolean(false);
    private final CountDownLatch loadLatch = new CountDownLatch(1);

    public boolean isLoaded() {
        return loaded.get();
    }

    public boolean awaitLoaded(long timeoutSeconds) {
        if (loaded.get()) return true;
        try {
            return loadLatch.await(timeoutSeconds, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return loaded.get();
        }
    }

    @Override
    public void run(String... args) {
        if (stateRepository.count() > 0) {
            loaded.set(true);
            loadLatch.countDown();
            return;
        }

        if (loading.compareAndSet(false, true)) {
            log.info("Starting data load asynchronously from: {}", DATA_API);
            Thread loader = new Thread(this::loadData, "kisanai-data-loader");
            loader.setDaemon(true);
            loader.start();
        }
    }

    private void loadData() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode countriesArray;
            try {
                URL url = new URL(DATA_API);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(30000);
                conn.setReadTimeout(120000);
                countriesArray = mapper.readTree(conn.getInputStream());
                log.info("Data fetched successfully, total countries: {}", countriesArray.size());
            } catch (Exception e) {
                log.error("Failed to fetch data: {}", e.getMessage(), e);
                return;
            }

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

            log.info("Data loaded successfully. States: {}, Districts: {}",
                    stateRepository.count(), districtRepository.count());
            loaded.set(true);
        } finally {
            loadLatch.countDown();
        }
    }
}