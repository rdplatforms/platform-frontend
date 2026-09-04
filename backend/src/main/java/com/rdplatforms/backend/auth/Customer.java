package com.rdplatforms.backend.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * An end customer's account on one business's public site — a separate
 * login realm from User/BusinessMembership (see TASKS.md Milestone 6).
 * Data model only for now; no registration/login endpoint exists yet.
 */
@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
public class Customer {

    @Id @GeneratedValue private UUID id;

    @Column(name = "business_id", nullable = false)
    private String businessId;

    @Column(nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    private String phone;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
