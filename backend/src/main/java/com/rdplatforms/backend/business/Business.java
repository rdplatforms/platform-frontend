package com.rdplatforms.backend.business;

import com.rdplatforms.backend.content.HasJsonData;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Mirrors packages/types/src/business.ts's Business, verbatim, in {@code
 * data}. See V2__content_tables.sql for why: field-for-field fidelity
 * with the TS contract is guaranteed by storing the JSON as-is, not by
 * hand-modeling every nested field (contact, hours[], social, etc.) into
 * columns. {@code slug} and {@code isActive} are duplicated as real
 * columns only because business resolution needs to query by them.
 */
@Entity
@Table(name = "businesses")
@Getter
@Setter
@NoArgsConstructor
public class Business implements HasJsonData {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private String data;
}
