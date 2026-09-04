package com.rdplatforms.backend.content;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

/** Mirrors packages/types/src/content.ts's FaqItem. */
@Entity
@Table(name = "faq_items")
@NoArgsConstructor
public class FaqItem extends BusinessScopedContent {
}
