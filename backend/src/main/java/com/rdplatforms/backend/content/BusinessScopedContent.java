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
 * Shared shape for every content type that is (a) its own row, keyed by
 * its own {@code id}, and (b) scoped to one business. See
 * V2__content_tables.sql for why {@code data} holds the full record as
 * JSON rather than modeling every field as a column.
 */
@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
public abstract class BusinessScopedContent implements HasJsonData {

    @Id
    private String id;

    @Column(name = "business_id", nullable = false)
    private String businessId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private String data;
}
