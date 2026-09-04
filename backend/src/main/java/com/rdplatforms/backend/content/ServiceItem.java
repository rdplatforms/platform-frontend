package com.rdplatforms.backend.content;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

/** Mirrors packages/types/src/content.ts's ServiceItem. */
@Entity
@Table(name = "service_items")
@NoArgsConstructor
public class ServiceItem extends BusinessScopedContent {
}
