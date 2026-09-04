package com.rdplatforms.backend.content;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

/** Mirrors packages/types/src/content.ts's BusinessSettings. */
@Entity
@Table(name = "business_settings")
@NoArgsConstructor
public class BusinessSettings extends BusinessSingletonContent {
}
