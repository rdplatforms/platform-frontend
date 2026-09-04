package com.rdplatforms.backend.content;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Shared shape for content types that are one row per business, with no
 * own {@code id} field in packages/types (BusinessTheme, SeoConfig,
 * BusinessSettings) — {@code businessId} is the natural primary key.
 */
@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
public abstract class BusinessSingletonContent {

    @Id
    @Column(name = "business_id")
    private String businessId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private String data;
}
