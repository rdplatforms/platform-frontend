package com.rdplatforms.backend.content;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

/** Mirrors packages/types/src/theme.ts's BusinessTheme. */
@Entity
@Table(name = "business_themes")
@NoArgsConstructor
public class BusinessTheme extends BusinessSingletonContent {
}
