package com.rdplatforms.backend.content;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Mirrors packages/types/src/content.ts's PageConfig. PageConfig has no
 * own {@code id} field — its natural key is (businessId, path) — so this
 * is the one content table needing a synthetic primary key (defaulted by
 * Postgres via gen_random_uuid(), see V2__content_tables.sql).
 */
@Entity
@Table(name = "page_configs")
@Getter
@Setter
@NoArgsConstructor
public class PageConfig {

    @Id
    private UUID id;

    @Column(name = "business_id", nullable = false)
    private String businessId;

    @Column(nullable = false)
    private String path;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private String data;
}
