package com.rdplatforms.backend.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * One-time bootstrap for the very first Super Admin account — there's no
 * other way to create one yet (no self-registration, by design). Only
 * runs under the "seed-super-admin" profile, with no default
 * email/password (fails loud rather than ever seeding a guessable
 * account):
 *
 * <pre>./gradlew bootRun --args='--spring.profiles.active=seed-super-admin --app.seed.super-admin-email=you@example.com --app.seed.super-admin-password=...'</pre>
 *
 * Idempotent — re-running updates the same user (matched by email)
 * rather than creating a duplicate. Exits when done, same as
 * StaticDataImportRunner.
 */
@Component
@Profile("seed-super-admin")
@Slf4j
public class SeedSuperAdminRunner implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ConfigurableApplicationContext context;
    private final String email;
    private final String password;
    private final String displayName;

    public SeedSuperAdminRunner(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ConfigurableApplicationContext context,
            @Value("${app.seed.super-admin-email}") String email,
            @Value("${app.seed.super-admin-password}") String password,
            @Value("${app.seed.super-admin-name:Super Admin}") String displayName) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.context = context;
        this.email = email;
        this.password = password;
        this.displayName = displayName;
    }

    @Override
    public void run(ApplicationArguments args) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setDisplayName(displayName);
        user.setSuperAdmin(true);
        user.setActive(true);
        userRepository.save(user);

        log.info("Seeded super admin: {}", email);
        System.exit(SpringApplication.exit(context, () -> 0));
    }
}
