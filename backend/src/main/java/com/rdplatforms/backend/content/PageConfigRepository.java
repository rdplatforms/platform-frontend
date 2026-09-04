package com.rdplatforms.backend.content;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PageConfigRepository extends JpaRepository<PageConfig, UUID> {
    List<PageConfig> findByBusinessId(String businessId);

    Optional<PageConfig> findByBusinessIdAndPath(String businessId, String path);
}
