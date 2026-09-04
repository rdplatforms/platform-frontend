package com.rdplatforms.backend.content;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

/** Mirrors packages/types/src/content.ts's SeoConfig. */
@Entity
@Table(name = "seo_configs")
@NoArgsConstructor
public class SeoConfig extends BusinessSingletonContent {
}
