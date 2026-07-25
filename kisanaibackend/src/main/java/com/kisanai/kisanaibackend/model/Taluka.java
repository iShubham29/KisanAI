package com.kisanai.kisanaibackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "talukas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Taluka{
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "district_id", nullable = false)
    private Integer districtId;
}