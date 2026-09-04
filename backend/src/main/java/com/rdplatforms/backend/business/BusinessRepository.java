package com.rdplatforms.backend.business;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessRepository extends JpaRepository<Business, String> {
    Optional<Business> findBySlug(String slug);
}
