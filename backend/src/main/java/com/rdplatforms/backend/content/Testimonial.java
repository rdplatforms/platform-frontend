package com.rdplatforms.backend.content;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

/** Mirrors packages/types/src/content.ts's Testimonial. */
@Entity
@Table(name = "testimonials")
@NoArgsConstructor
public class Testimonial extends BusinessScopedContent {
}
