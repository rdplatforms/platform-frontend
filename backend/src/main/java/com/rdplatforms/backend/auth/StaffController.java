package com.rdplatforms.backend.auth;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Business Owner capability (TASK-011): invite/create/deactivate Staff
 * accounts for their own business, and grant/revoke the
 * canViewFullAnalytics permission. Every method requires the actor to
 * either be a Super Admin or hold an OWNER membership for this specific
 * businessId — Staff themselves can never manage other Staff, and an
 * Owner of a *different* business can't either (checked against the
 * JWT's own membership claims, no DB round-trip needed for the check
 * itself).
 */
@RestController
@RequestMapping("/businesses/{businessId}/staff")
public class StaffController {

    private final BusinessMembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffController(
            BusinessMembershipRepository membershipRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<?> listStaff(
            @AuthenticationPrincipal AuthenticatedUser actor, @PathVariable String businessId) {
        ResponseEntity<?> forbidden = requireOwner(actor, businessId);
        if (forbidden != null) {
            return forbidden;
        }
        List<StaffMemberView> staff =
                membershipRepository.findByBusinessIdAndRole(businessId, MembershipRole.STAFF).stream()
                        .map(
                                membership -> {
                                    User user = userRepository.findById(membership.getUserId()).orElseThrow();
                                    return new StaffMemberView(
                                            membership.getId(),
                                            user.getId(),
                                            user.getEmail(),
                                            user.getDisplayName(),
                                            membership.isCanViewFullAnalytics());
                                })
                        .toList();
        return ResponseEntity.ok(staff);
    }

    @PostMapping
    public ResponseEntity<?> createStaff(
            @AuthenticationPrincipal AuthenticatedUser actor,
            @PathVariable String businessId,
            @RequestBody CreateStaffRequest request) {
        ResponseEntity<?> forbidden = requireOwner(actor, businessId);
        if (forbidden != null) {
            return forbidden;
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

        // Idempotent, same reasoning as BusinessAdminController.createOwner:
        // re-inviting an existing staff member updates their membership
        // instead of throwing a raw unique-constraint violation.
        BusinessMembership membership =
                membershipRepository
                        .findByUserIdAndBusinessId(saved.getId(), businessId)
                        .orElseGet(BusinessMembership::new);
        membership.setUserId(saved.getId());
        membership.setBusinessId(businessId);
        membership.setRole(MembershipRole.STAFF);
        membership.setCanViewFullAnalytics(request.canViewFullAnalytics());
        BusinessMembership savedMembership = membershipRepository.save(membership);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        new StaffMemberView(
                                savedMembership.getId(),
                                saved.getId(),
                                saved.getEmail(),
                                saved.getDisplayName(),
                                savedMembership.isCanViewFullAnalytics()));
    }

    @PatchMapping("/{membershipId}")
    public ResponseEntity<?> updateStaff(
            @AuthenticationPrincipal AuthenticatedUser actor,
            @PathVariable String businessId,
            @PathVariable UUID membershipId,
            @RequestBody UpdateStaffRequest request) {
        ResponseEntity<?> forbidden = requireOwner(actor, businessId);
        if (forbidden != null) {
            return forbidden;
        }
        return findStaffMembership(businessId, membershipId)
                .map(
                        membership -> {
                            membership.setCanViewFullAnalytics(request.canViewFullAnalytics());
                            membershipRepository.save(membership);
                            return ResponseEntity.ok().build();
                        })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{membershipId}")
    public ResponseEntity<?> removeStaff(
            @AuthenticationPrincipal AuthenticatedUser actor,
            @PathVariable String businessId,
            @PathVariable UUID membershipId) {
        ResponseEntity<?> forbidden = requireOwner(actor, businessId);
        if (forbidden != null) {
            return forbidden;
        }
        return findStaffMembership(businessId, membershipId)
                .map(
                        membership -> {
                            membershipRepository.delete(membership);
                            return ResponseEntity.noContent().build();
                        })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** Scoped to STAFF role only — an Owner removing/editing another Owner's membership is out of scope here. */
    private java.util.Optional<BusinessMembership> findStaffMembership(
            String businessId, UUID membershipId) {
        return membershipRepository
                .findById(membershipId)
                .filter(m -> m.getBusinessId().equals(businessId))
                .filter(m -> m.getRole() == MembershipRole.STAFF);
    }

    private ResponseEntity<?> requireOwner(AuthenticatedUser actor, String businessId) {
        if (actor == null || (!actor.superAdmin() && !actor.hasMembership(businessId, MembershipRole.OWNER))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Business Owner only"));
        }
        return null;
    }
}
