package com.rdplatforms.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.rdplatforms.backend.business.Business;
import com.rdplatforms.backend.business.BusinessRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
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
class StaffControllerTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @Autowired private TestRestTemplate restTemplate;
    @Autowired private UserRepository userRepository;
    @Autowired private BusinessRepository businessRepository;
    @Autowired private BusinessMembershipRepository membershipRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String businessId;
    private String ownerToken;
    private String outsiderToken;

    @BeforeEach
    void seed() {
        String suffix = UUID.randomUUID().toString();
        businessId = "staff-test-biz-" + suffix;

        Business business = new Business();
        business.setId(businessId);
        business.setSlug(businessId);
        business.setActive(true);
        business.setData("{\"id\":\"" + businessId + "\"}");
        businessRepository.save(business);

        String ownerEmail = "owner-" + suffix + "@test.example";
        User owner = new User();
        owner.setEmail(ownerEmail);
        owner.setPasswordHash(passwordEncoder.encode("password123"));
        owner.setDisplayName("Owner");
        owner.setActive(true);
        User savedOwner = userRepository.save(owner);

        BusinessMembership ownership = new BusinessMembership();
        ownership.setUserId(savedOwner.getId());
        ownership.setBusinessId(businessId);
        ownership.setRole(MembershipRole.OWNER);
        membershipRepository.save(ownership);

        String outsiderEmail = "outsider-" + suffix + "@test.example";
        User outsider = new User();
        outsider.setEmail(outsiderEmail);
        outsider.setPasswordHash(passwordEncoder.encode("password123"));
        outsider.setDisplayName("Outsider");
        outsider.setActive(true);
        userRepository.save(outsider);

        ownerToken = login(ownerEmail, "password123");
        outsiderToken = login(outsiderEmail, "password123");
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
    void staffListIsNotPublic() {
        ResponseEntity<String> response =
                restTemplate.getForEntity("/businesses/" + businessId + "/staff", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void onlyTheBusinessOwnerCanManageStaff() {
        var body =
                Map.of(
                        "email", "staff@test.example", "password", "x", "displayName", "X",
                        "canViewFullAnalytics", false);
        ResponseEntity<String> response =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/staff",
                        HttpMethod.POST,
                        withAuth(outsiderToken, body),
                        String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void ownerCanCreateListPatchAndRemoveStaff() {
        var createBody =
                Map.of(
                        "email", "staff@test.example", "password", "staffpass123", "displayName", "Staffer",
                        "canViewFullAnalytics", false);
        ResponseEntity<StaffMemberView> created =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/staff",
                        HttpMethod.POST,
                        withAuth(ownerToken, createBody),
                        StaffMemberView.class);
        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        UUID membershipId = created.getBody().membershipId();
        assertThat(created.getBody().canViewFullAnalytics()).isFalse();

        ResponseEntity<StaffMemberView[]> list =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/staff",
                        HttpMethod.GET,
                        withAuth(ownerToken, null),
                        StaffMemberView[].class);
        assertThat(List.of(list.getBody())).hasSize(1);

        restTemplate.exchange(
                "/businesses/" + businessId + "/staff/" + membershipId,
                HttpMethod.PATCH,
                withAuth(ownerToken, Map.of("canViewFullAnalytics", true)),
                Void.class);

        String staffToken = login("staff@test.example", "staffpass123");
        ResponseEntity<String> staffTriesToListStaff =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/staff",
                        HttpMethod.GET,
                        withAuth(staffToken, null),
                        String.class);
        assertThat(staffTriesToListStaff.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

        restTemplate.exchange(
                "/businesses/" + businessId + "/staff/" + membershipId,
                HttpMethod.DELETE,
                withAuth(ownerToken, null),
                Void.class);

        ResponseEntity<StaffMemberView[]> listAfterRemoval =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/staff",
                        HttpMethod.GET,
                        withAuth(ownerToken, null),
                        StaffMemberView[].class);
        assertThat(List.of(listAfterRemoval.getBody())).isEmpty();
    }

    @Test
    void creatingTheSameStaffMemberTwiceIsIdempotentNotAConflict() {
        var body =
                Map.of(
                        "email", "repeat@test.example", "password", "x", "displayName", "X",
                        "canViewFullAnalytics", false);
        ResponseEntity<String> first =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/staff",
                        HttpMethod.POST,
                        withAuth(ownerToken, body),
                        String.class);
        assertThat(first.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ResponseEntity<String> second =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/staff",
                        HttpMethod.POST,
                        withAuth(ownerToken, body),
                        String.class);
        assertThat(second.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}
