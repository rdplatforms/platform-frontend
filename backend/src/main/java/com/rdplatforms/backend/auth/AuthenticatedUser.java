package com.rdplatforms.backend.auth;

import java.util.List;
import java.util.UUID;

/** Decoded from a valid JWT — see JwtService. Set as the Authentication principal. */
public record AuthenticatedUser(
        UUID userId, String email, boolean superAdmin, List<MembershipClaim> memberships) {

    public boolean hasMembership(String businessId, MembershipRole role) {
        return memberships.stream()
                .anyMatch(m -> m.businessId().equals(businessId) && m.role() == role);
    }

    public boolean canAccessBusiness(String businessId) {
        return superAdmin || memberships.stream().anyMatch(m -> m.businessId().equals(businessId));
    }

    public record MembershipClaim(String businessId, MembershipRole role, boolean canViewFullAnalytics) {}
}
