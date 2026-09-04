package com.rdplatforms.backend.content;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BusinessScopedContentRepository<T extends BusinessScopedContent>
        extends JpaRepository<T, String> {
    List<T> findByBusinessId(String businessId);
}
