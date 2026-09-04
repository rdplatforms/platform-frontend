package com.rdplatforms.backend.business;

import static org.assertj.core.api.Assertions.assertThat;

import com.rdplatforms.backend.auth.User;
import com.rdplatforms.backend.auth.UserRepository;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestRestTemplate
@Testcontainers
class BusinessAdminControllerTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @Autowired private TestRestTemplate restTemplate;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String superAdminToken;
    private String regularUserToken;

    /**
     * Emails are unique per test method (java.util.UUID, not a fixed
     * string) — the Testcontainers Postgres instance is shared across
     * every test method in this class (a fresh container per test would
     * be far slower), so re-inserting the same email in each
     * {@code @BeforeEach} would violate the unique constraint on the
     * second test onward.
     */
    @BeforeEach
    void seedUsers() {
        String suffix = java.util.UUID.randomUUID().toString();

        String superAdminEmail = "super-" + suffix + "@test.example";
        User superAdmin = new User();
        superAdmin.setEmail(superAdminEmail);
        superAdmin.setPasswordHash(passwordEncoder.encode("password123"));
        superAdmin.setDisplayName("Super Admin");
        superAdmin.setSuperAdmin(true);
        superAdmin.setActive(true);
        userRepository.save(superAdmin);

        String regularEmail = "regular-" + suffix + "@test.example";
        User regular = new User();
        regular.setEmail(regularEmail);
        regular.setPasswordHash(passwordEncoder.encode("password123"));
        regular.setDisplayName("Regular User");
        regular.setSuperAdmin(false);
        regular.setActive(true);
        userRepository.save(regular);

        superAdminToken = login(superAdminEmail, "password123");
        regularUserToken = login(regularEmail, "password123");
    }

    private String login(String email, String password) {
        var response =
                restTemplate.postForEntity(
                        "/auth/login", Map.of("email", email, "password", password), Map.class);
        return (String) response.getBody().get("token");
    }

    private HttpEntity<Object> withAuth(String token, Object body) {
        HttpHeaders headers = new HttpHeaders();
        if (token != null) {
            headers.setBearerAuth(token);
        }
        return new HttpEntity<>(body, headers);
    }

    @Test
    void createBusinessRequiresAuth() {
        var body =
                Map.of(
                        "slug", "no-auth-biz", "displayName", "X", "legalName", "X", "category", "salon",
                        "phone", "1");
        ResponseEntity<String> response =
                restTemplate.exchange("/businesses", HttpMethod.POST, withAuth(null, body), String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void createBusinessRejectsANonSuperAdmin() {
        var body =
                Map.of(
                        "slug", "regular-biz", "displayName", "X", "legalName", "X", "category", "salon",
                        "phone", "1");
        ResponseEntity<String> response =
                restTemplate.exchange(
                        "/businesses", HttpMethod.POST, withAuth(regularUserToken, body), String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void superAdminCanCreateABusinessAndDuplicateSlugIsRejected() {
        var body =
                Map.of(
                        "slug",
                        "integration-test-biz",
                        "displayName",
                        "Integration Test Salon",
                        "legalName",
                        "Integration Test Salon LLC",
                        "category",
                        "salon",
                        "phone",
                        "555-0100");

        ResponseEntity<String> created =
                restTemplate.exchange(
                        "/businesses", HttpMethod.POST, withAuth(superAdminToken, body), String.class);
        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(created.getBody()).contains("\"isActive\":true");

        ResponseEntity<String> duplicate =
                restTemplate.exchange(
                        "/businesses", HttpMethod.POST, withAuth(superAdminToken, body), String.class);
        assertThat(duplicate.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void superAdminCanSuspendAndReactivateABusiness() {
        var createBody =
                Map.of(
                        "slug", "suspend-test-biz", "displayName", "X", "legalName", "X", "category", "salon",
                        "phone", "1");
        restTemplate.exchange(
                "/businesses", HttpMethod.POST, withAuth(superAdminToken, createBody), String.class);

        ResponseEntity<String> suspended =
                restTemplate.exchange(
                        "/businesses/suspend-test-biz/status",
                        HttpMethod.PATCH,
                        withAuth(superAdminToken, Map.of("isActive", false)),
                        String.class);
        assertThat(suspended.getBody()).contains("\"isActive\":false");

        ResponseEntity<String> publicView =
                restTemplate.getForEntity("/businesses/by-slug/suspend-test-biz", String.class);
        assertThat(publicView.getBody()).contains("\"isActive\":false");
    }

    @Test
    void superAdminCanCreateAnOwnerWhoCanThenLogIn() {
        var createBody =
                Map.of(
                        "slug", "owner-test-biz", "displayName", "X", "legalName", "X", "category", "salon",
                        "phone", "1");
        restTemplate.exchange(
                "/businesses", HttpMethod.POST, withAuth(superAdminToken, createBody), String.class);

        var ownerBody =
                Map.of(
                        "email", "newowner@test.example", "password", "ownerpass123", "displayName", "New Owner");
        ResponseEntity<Void> created =
                restTemplate.exchange(
                        "/businesses/owner-test-biz/owners",
                        HttpMethod.POST,
                        withAuth(superAdminToken, ownerBody),
                        Void.class);
        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        String ownerToken = login("newowner@test.example", "ownerpass123");
        ResponseEntity<String> me =
                restTemplate.exchange("/auth/me", HttpMethod.GET, withAuth(ownerToken, null), String.class);
        assertThat(me.getBody()).contains("\"businessId\":\"owner-test-biz\"").contains("\"role\":\"OWNER\"");
    }
}
