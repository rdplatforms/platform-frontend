package com.rdplatforms.backend.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Issues and validates JWTs for internal (User) accounts — Customer auth
 * (Milestone 6) will need its own tokens, kept separate since it's a
 * different realm entirely. Every membership is embedded in the token
 * (businessId/role/canViewFullAnalytics) so a protected endpoint can
 * authorize without a database round-trip per request.
 */
@Component
public class JwtService {

    private final SecretKey key;
    private final Duration expiration;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-minutes:1440}") long expirationMinutes) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = Duration.ofMinutes(expirationMinutes);
    }

    public String generateToken(User user, List<BusinessMembership> memberships) {
        Instant now = Instant.now();
        List<Map<String, Object>> membershipClaims =
                memberships.stream()
                        .map(
                                m ->
                                        Map.<String, Object>of(
                                                "businessId", m.getBusinessId(),
                                                "role", m.getRole().name(),
                                                "canViewFullAnalytics", m.isCanViewFullAnalytics()))
                        .toList();

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("superAdmin", user.isSuperAdmin())
                .claim("memberships", membershipClaims)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expiration)))
                .signWith(key)
                .compact();
    }

    @SuppressWarnings("unchecked")
    public AuthenticatedUser parseToken(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();

        UUID userId = UUID.fromString(claims.getSubject());
        String email = claims.get("email", String.class);
        boolean superAdmin = Boolean.TRUE.equals(claims.get("superAdmin", Boolean.class));

        List<Map<String, Object>> rawMemberships = claims.get("memberships", List.class);
        List<AuthenticatedUser.MembershipClaim> memberships =
                rawMemberships == null
                        ? List.of()
                        : rawMemberships.stream()
                                .map(
                                        m ->
                                                new AuthenticatedUser.MembershipClaim(
                                                        (String) m.get("businessId"),
                                                        MembershipRole.valueOf((String) m.get("role")),
                                                        Boolean.TRUE.equals(m.get("canViewFullAnalytics"))))
                                .toList();

        return new AuthenticatedUser(userId, email, superAdmin, memberships);
    }
}
