package com.rdplatforms.backend.content;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

/** Mirrors packages/types/src/content.ts's TeamMember. */
@Entity
@Table(name = "team_members")
@NoArgsConstructor
public class TeamMember extends BusinessScopedContent {
}
