package com.rdplatforms.backend.business;

import com.rdplatforms.backend.auth.AuthenticatedUser;
import com.rdplatforms.backend.auth.BusinessMembership;
import com.rdplatforms.backend.auth.BusinessMembershipRepository;
import com.rdplatforms.backend.auth.MembershipRole;
import com.rdplatforms.backend.auth.User;
import com.rdplatforms.backend.auth.UserRepository;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

/**
 * Super Admin-only platform management: create/suspend a Business
 * tenant, create its first Business Owner (TASK-009). Deliberately
 * separate from BusinessController (public, read-only) even though it
 * shares the /businesses path — SecurityConfig only permits GET there;
 * every method here is authorization-checked against
 * AuthenticatedUser.superAdmin(), not just "has a valid token."
 *
 * Known BusinessCategory values, duplicated from
 * packages/types/src/business.ts — there's no shared schema between the
 * Java backend and the TypeScript frontend yet, so this list must be
 * kept in sync by hand until/unless that changes.
 */
@RestController
@RequestMapping("/businesses")
public class BusinessAdminController {

    private static final Set<String> VALID_CATEGORIES =
            Set.of(
                    "salon",
                    "restaurant",
                    "design-studio",
                    "gym",
                    "dental-clinic",
                    "hotel",
                    "interior-design",
                    "photography",
                    "legal",
                    "architecture",
                    "ecommerce",
                    "real-estate");

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final BusinessMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public BusinessAdminController(
            BusinessRepository businessRepository,
            UserRepository userRepository,
            BusinessMembershipRepository membershipRepository,
            PasswordEncoder passwordEncoder,
            ObjectMapper objectMapper) {
        this.businessRepository = businessRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<?> createBusiness(
            @AuthenticationPrincipal AuthenticatedUser actor, @RequestBody CreateBusinessRequest request) {
        ResponseEntity<?> forbidden = requireSuperAdmin(actor);
        if (forbidden != null) {
            return forbidden;
        }
        if (request.slug() == null || request.slug().isBlank()) {
            return ResponseEntity.badRequest().body(errorBody("slug is required"));
        }
        if (!VALID_CATEGORIES.contains(request.category())) {
            return ResponseEntity.badRequest()
                    .body(errorBody("category must be one of " + VALID_CATEGORIES));
        }
        if (businessRepository.findBySlug(request.slug()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorBody("slug already exists"));
        }

        ObjectNode contact = objectMapper.createObjectNode();
        contact.put("phone", request.phone());
        contact.set("address", objectMapper.createObjectNode());

        ObjectNode json = objectMapper.createObjectNode();
        json.put("id", request.slug());
        json.put("slug", request.slug());
        json.put("legalName", request.legalName());
        json.put("displayName", request.displayName());
        json.put("category", request.category());
        json.put("logoUrl", "");
        json.put("description", "");
        json.set("contact", contact);
        json.set("hours", objectMapper.createArrayNode());
        json.set("social", objectMapper.createObjectNode());
        json.set("domains", objectMapper.createArrayNode());
        json.put("isActive", true);

        Business business = new Business();
        business.setId(request.slug());
        business.setSlug(request.slug());
        business.setActive(true);
        business.setData(json.toString());
        businessRepository.save(business);

        return ResponseEntity.status(HttpStatus.CREATED).body(json);
    }

    @PatchMapping("/{businessId}/status")
    public ResponseEntity<?> updateStatus(
            @AuthenticationPrincipal AuthenticatedUser actor,
            @PathVariable String businessId,
            @RequestBody UpdateBusinessStatusRequest request) {
        ResponseEntity<?> forbidden = requireSuperAdmin(actor);
        if (forbidden != null) {
            return forbidden;
        }
        return businessRepository
                .findById(businessId)
                .map(
                        business -> {
                            ObjectNode json = (ObjectNode) objectMapper.readTree(business.getData());
                            json.put("isActive", request.isActive());
                            business.setActive(request.isActive());
                            business.setData(json.toString());
                            businessRepository.save(business);
                            return ResponseEntity.ok(json);
                        })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{businessId}/owners")
    public ResponseEntity<?> createOwner(
            @AuthenticationPrincipal AuthenticatedUser actor,
            @PathVariable String businessId,
            @RequestBody CreateOwnerRequest request) {
        ResponseEntity<?> forbidden = requireSuperAdmin(actor);
        if (forbidden != null) {
            return forbidden;
        }
        if (businessRepository.findById(businessId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userRepository.findByEmail(request.email()).orElseGet(User::new);
        boolean isNewUser = user.getId() == null;
        user.setEmail(request.email());
        user.setDisplayName(request.displayName());
        user.setActive(true);
        if (isNewUser) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
            user.setSuperAdmin(false);
        }
        User saved = userRepository.save(user);

        // Idempotent: calling this twice for the same email must not throw a
        // raw unique-constraint violation — update the existing membership's
        // role instead of inserting a duplicate.
        BusinessMembership membership =
                membershipRepository
                        .findByUserIdAndBusinessId(saved.getId(), businessId)
                        .orElseGet(BusinessMembership::new);
        boolean isNewMembership = membership.getId() == null;
        membership.setUserId(saved.getId());
        membership.setBusinessId(businessId);
        membership.setRole(MembershipRole.OWNER);
        membershipRepository.save(membership);

        return ResponseEntity.status(isNewMembership ? HttpStatus.CREATED : HttpStatus.OK).build();
    }

    private ResponseEntity<?> requireSuperAdmin(AuthenticatedUser actor) {
        if (actor == null || !actor.superAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorBody("Super Admin only"));
        }
        return null;
    }

    private static java.util.Map<String, String> errorBody(String message) {
        return java.util.Map.of("message", message);
    }
}
