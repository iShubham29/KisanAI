package com.kisanai.kisanaibackend.config;

import com.kisanai.kisanaibackend.service.DataLoaderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class StartupListener {

    private final ObjectProvider<DataLoaderService> dataLoaderServiceProvider;
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public StartupListener(ObjectProvider<DataLoaderService> dataLoaderServiceProvider) {
        this.dataLoaderServiceProvider = dataLoaderServiceProvider;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("Application ready. Scheduling data load in 10 seconds to allow Render health checks to pass.");
        scheduler.schedule(this::triggerDataLoad, 10, TimeUnit.SECONDS);
    }

    private void triggerDataLoad() {
        try {
            dataLoaderServiceProvider.get().startLoadingIfNeeded();
        } catch (Exception e) {
            log.error("Failed to trigger data load: {}", e.getMessage(), e);
        }
    }
}
