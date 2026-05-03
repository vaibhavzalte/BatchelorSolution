package com.uv.bsol_backend.repository;

import com.uv.bsol_backend.entity.ListingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListingsRepository extends JpaRepository<ListingsEntity, Long> {
    ListingsEntity findByIdAndTypeAndStatus(Long id, String type, String status);
}
