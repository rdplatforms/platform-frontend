package com.rdplatforms.backend.booking;

import static org.assertj.core.api.Assertions.assertThat;

import com.rdplatforms.backend.auth.BusinessMembership;
import com.rdplatforms.backend.auth.BusinessMembershipRepository;
import com.rdplatforms.backend.auth.MembershipRole;
import com.rdplatforms.backend.auth.User;
import com.rdplatforms.backend.auth.UserRepository;
import com.rdplatforms.backend.business.Business;
import com.rdplatforms.backend.business.BusinessRepository;
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
class BookingControllerTest {

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

    @BeforeEach
    void seed() {
        String suffix = UUID.randomUUID().toString();
        businessId = "booking-test-biz-" + suffix;

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

        ownerToken = login(ownerEmail, "password123");
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

    private Map<String, Object> bookingBody(String date, String time) {
        return Map.of(
                "serviceId", "svc-1",
                "customerName", "Test Customer",
                "preferredDate", date,
                "preferredTime", time,
                "note", "test note");
    }

    @Test
    void unauthenticatedCreateIsPublicAndAlwaysOnlinePending() {
        ResponseEntity<Booking> response =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/bookings",
                        HttpMethod.POST,
                        withAuth(null, bookingBody("2026-10-01", "11:00")),
                        Booking.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getSource()).isEqualTo(BookingSource.ONLINE);
        assertThat(response.getBody().getStatus()).isEqualTo(BookingStatus.PENDING);
    }

    @Test
    void authenticatedMemberCreateIsStaffConfirmed() {
        ResponseEntity<Booking> response =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/bookings",
                        HttpMethod.POST,
                        withAuth(ownerToken, bookingBody("2026-10-02", "12:00")),
                        Booking.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getSource()).isEqualTo(BookingSource.STAFF);
        assertThat(response.getBody().getStatus()).isEqualTo(BookingStatus.CONFIRMED);
    }

    @Test
    void listingRequiresBusinessMembership() {
        ResponseEntity<String> unauthenticated =
                restTemplate.getForEntity("/businesses/" + businessId + "/bookings", String.class);
        assertThat(unauthenticated.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

        restTemplate.exchange(
                "/businesses/" + businessId + "/bookings",
                HttpMethod.POST,
                withAuth(null, bookingBody("2026-10-03", "13:00")),
                Booking.class);

        ResponseEntity<Booking[]> asOwner =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/bookings",
                        HttpMethod.GET,
                        withAuth(ownerToken, null),
                        Booking[].class);
        assertThat(asOwner.getBody()).hasSize(1);
    }

    @Test
    void ownerCanUpdateStatusButAnOutsiderCannot() {
        ResponseEntity<Booking> created =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/bookings",
                        HttpMethod.POST,
                        withAuth(null, bookingBody("2026-10-04", "14:00")),
                        Booking.class);
        UUID bookingId = created.getBody().getId();

        // A different business's owner must not see or change this booking.
        String otherBusinessId = "other-biz-" + UUID.randomUUID();
        Business otherBusiness = new Business();
        otherBusiness.setId(otherBusinessId);
        otherBusiness.setSlug(otherBusinessId);
        otherBusiness.setActive(true);
        otherBusiness.setData("{\"id\":\"" + otherBusinessId + "\"}");
        businessRepository.save(otherBusiness);

        String outsiderEmail = "outsider-" + UUID.randomUUID() + "@test.example";
        User outsider = new User();
        outsider.setEmail(outsiderEmail);
        outsider.setPasswordHash(passwordEncoder.encode("password123"));
        outsider.setDisplayName("Outsider");
        outsider.setActive(true);
        User savedOutsider = userRepository.save(outsider);
        BusinessMembership otherMembership = new BusinessMembership();
        otherMembership.setUserId(savedOutsider.getId());
        otherMembership.setBusinessId(otherBusinessId);
        otherMembership.setRole(MembershipRole.OWNER);
        membershipRepository.save(otherMembership);
        String outsiderToken = login(outsiderEmail, "password123");

        ResponseEntity<String> outsiderPatch =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/bookings/" + bookingId + "/status",
                        HttpMethod.PATCH,
                        withAuth(outsiderToken, Map.of("status", "CANCELLED")),
                        String.class);
        assertThat(outsiderPatch.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

        ResponseEntity<Booking> ownerPatch =
                restTemplate.exchange(
                        "/businesses/" + businessId + "/bookings/" + bookingId + "/status",
                        HttpMethod.PATCH,
                        withAuth(ownerToken, Map.of("status", "CONFIRMED")),
                        Booking.class);
        assertThat(ownerPatch.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(ownerPatch.getBody().getStatus()).isEqualTo(BookingStatus.CONFIRMED);
    }

    @Test
    void createReturns404ForAnUnknownBusiness() {
        ResponseEntity<String> response =
                restTemplate.exchange(
                        "/businesses/does-not-exist/bookings",
                        HttpMethod.POST,
                        withAuth(null, bookingBody("2026-10-05", "15:00")),
                        String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
