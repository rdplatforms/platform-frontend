package com.rdplatforms.backend.content;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

/** Mirrors packages/types/src/content.ts's GalleryItem. */
@Entity
@Table(name = "gallery_items")
@NoArgsConstructor
public class GalleryItem extends BusinessScopedContent {
}
