package com.rdplatforms.backend.auth;

import java.util.UUID;

/** BusinessMembership joined with its User's email/displayName, for the Owner's staff list. */
public record StaffMemberView(
        UUID membershipId,
        UUID userId,
        String email,
        String displayName,
        boolean canViewFullAnalytics) {}
