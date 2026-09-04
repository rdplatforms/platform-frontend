package com.rdplatforms.backend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BusinessMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            BusinessMembershipRepository membershipRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public record LoginRequest(String email, String password) {}

    public record LoginResponse(String token) {}

    /**
     * One endpoint for every internal account type (Super Admin, Business
     * Owner, Staff) — the issued token's memberships claim is whatever
     * that user actually has; a client (apps/admin, apps/portal) checks
     * for the access it needs, not this endpoint.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return userRepository
                .findByEmail(request.email())
                .filter(User::isActive)
                .filter(user -> passwordEncoder.matches(request.password(), user.getPasswordHash()))
                .map(
                        user -> {
                            var memberships = membershipRepository.findByUserId(user.getId());
                            return ResponseEntity.ok(
                                    new LoginResponse(jwtService.generateToken(user, memberships)));
                        })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @GetMapping("/me")
    public AuthenticatedUser me(@AuthenticationPrincipal AuthenticatedUser user) {
        return user;
    }
}
