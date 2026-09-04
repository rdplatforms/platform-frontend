package com.rdplatforms.backend.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** A User's relationship (OWNER or STAFF) to one business. */
@Entity
@Table(name = "business_memberships")
@Getter
@Setter
@NoArgsConstructor
public class BusinessMembership {

    @Id @GeneratedValue private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "business_id", nullable = false)
    private String businessId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MembershipRole role;

    /** Owner-granted opt-in for a Staff member; meaningless for OWNER rows. */
    @Column(name = "can_view_full_analytics", nullable = false)
    private boolean canViewFullAnalytics;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
