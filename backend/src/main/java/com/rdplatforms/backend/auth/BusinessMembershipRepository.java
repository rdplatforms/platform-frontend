package com.rdplatforms.backend.auth;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessMembershipRepository extends JpaRepository<BusinessMembership, UUID> {
    List<BusinessMembership> findByUserId(UUID userId);

    List<BusinessMembership> findByBusinessId(String businessId);
}
