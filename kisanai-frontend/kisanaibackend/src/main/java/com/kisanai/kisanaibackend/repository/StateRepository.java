package com.kisanai.kisanaibackend.repository;

import com.kisanai.kisanaibackend.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends JpaRepository<State, Integer> {
}