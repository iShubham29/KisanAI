package com.kisanai.kisanaibackend.repository;

import com.kisanai.kisanaibackend.model.Taluka;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TalukaRepository extends JpaRepository<Taluka, Integer> {
    // Explanation written in DistricRepo
    List<Taluka> findByDistrictId(Integer districtId);
}