package com.rdplatforms.backend.auth;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessMembershipRepository extends JpaRepository<BusinessMembership, UUID> {
    List<BusinessMembership> findByUserId(UUID userId);

    List<BusinessMembership> findByBusinessId(String businessId);

    List<BusinessMembership> findByBusinessIdAndRole(String businessId, MembershipRole role);

    Optional<BusinessMembership> findByUserIdAndBusinessId(UUID userId, String businessId);
}
