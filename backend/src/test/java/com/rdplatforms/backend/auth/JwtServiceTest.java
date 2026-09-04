package com.rdplatforms.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import io.jsonwebtoken.JwtException;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    // 32 bytes — a real deployment must set its own via app.jwt.secret, never this one.
    private final JwtService jwtService =
            new JwtService("test-only-secret-key-not-for-real-use-32b", 60);

    @Test
    void roundTripsASuperAdminWithNoMemberships() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("admin@rdplatforms.com");
        user.setSuperAdmin(true);

        String token = jwtService.generateToken(user, List.of());
        AuthenticatedUser parsed = jwtService.parseToken(token);

        assertThat(parsed.userId()).isEqualTo(user.getId());
        assertThat(parsed.email()).isEqualTo("admin@rdplatforms.com");
        assertThat(parsed.superAdmin()).isTrue();
        assertThat(parsed.memberships()).isEmpty();
    }

    @Test
    void roundTripsBusinessMemberships() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("owner@salon.example");
        user.setSuperAdmin(false);

        BusinessMembership ownerMembership = new BusinessMembership();
        ownerMembership.setBusinessId("swami-hair-salon");
        ownerMembership.setRole(MembershipRole.OWNER);
        ownerMembership.setCanViewFullAnalytics(false);

        BusinessMembership staffMembership = new BusinessMembership();
        staffMembership.setBusinessId("urban-bistro");
        staffMembership.setRole(MembershipRole.STAFF);
        staffMembership.setCanViewFullAnalytics(true);

        String token = jwtService.generateToken(user, List.of(ownerMembership, staffMembership));
        AuthenticatedUser parsed = jwtService.parseToken(token);

        assertThat(parsed.superAdmin()).isFalse();
        assertThat(parsed.hasMembership("swami-hair-salon", MembershipRole.OWNER)).isTrue();
        assertThat(parsed.hasMembership("urban-bistro", MembershipRole.STAFF)).isTrue();
        assertThat(parsed.hasMembership("urban-bistro", MembershipRole.OWNER)).isFalse();
        assertThat(parsed.canAccessBusiness("swami-hair-salon")).isTrue();
        assertThat(parsed.canAccessBusiness("vision3d")).isFalse();
    }

    @Test
    void rejectsATokenSignedWithADifferentSecret() {
        JwtService otherService = new JwtService("a-completely-different-secret-key-32byte", 60);
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("x@example.com");

        String token = otherService.generateToken(user, List.of());

        assertThatThrownBy(() -> jwtService.parseToken(token)).isInstanceOf(JwtException.class);
    }
}
