package com.kisanai.kisanaibackend.repository;

import com.kisanai.kisanaibackend.model.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<District, Integer> {
    //To filter the Districts that are present within a particular state, we need to add those districts in a particular list
    // Internally works as SQL Query : SELECT * FROM districts WHERE state_code = 'MH'


    List<District> findByStateCode(String stateCode);
}