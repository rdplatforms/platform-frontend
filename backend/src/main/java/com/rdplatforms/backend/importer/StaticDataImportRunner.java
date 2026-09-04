package com.rdplatforms.backend.importer;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.rdplatforms.backend.business.Business;
import com.rdplatforms.backend.business.BusinessRepository;
import com.rdplatforms.backend.content.BusinessScopedContent;
import com.rdplatforms.backend.content.BusinessScopedContentRepository;
import com.rdplatforms.backend.content.BusinessSettings;
import com.rdplatforms.backend.content.BusinessSettingsRepository;
import com.rdplatforms.backend.content.BusinessSingletonContent;
import com.rdplatforms.backend.content.BusinessTheme;
import com.rdplatforms.backend.content.BusinessThemeRepository;
import com.rdplatforms.backend.content.FaqItem;
import com.rdplatforms.backend.content.FaqItemRepository;
import com.rdplatforms.backend.content.GalleryItem;
import com.rdplatforms.backend.content.GalleryItemRepository;
import com.rdplatforms.backend.content.PageConfig;
import com.rdplatforms.backend.content.PageConfigRepository;
import com.rdplatforms.backend.content.SeoConfig;
import com.rdplatforms.backend.content.SeoConfigRepository;
import com.rdplatforms.backend.content.ServiceItem;
import com.rdplatforms.backend.content.ServiceItemRepository;
import com.rdplatforms.backend.content.Testimonial;
import com.rdplatforms.backend.content.TestimonialRepository;
import com.rdplatforms.backend.content.TeamMember;
import com.rdplatforms.backend.content.TeamMemberRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.function.Supplier;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * One-time import of static-data/*.json into Postgres (TASK-003). Not
 * part of normal application startup — only runs under the
 * "import-static-data" profile:
 *
 * <pre>./gradlew bootRun --args='--spring.profiles.active=import-static-data'</pre>
 *
 * Idempotent: every upsert is keyed by the same id/businessId+path the
 * frontend's static-data already uses, so re-running this after editing
 * static-data/*.json is always safe. Exits the process when done — this
 * is a one-shot tool, not a server.
 */
@Component
@Profile("import-static-data")
@Slf4j
public class StaticDataImportRunner implements ApplicationRunner {

    private final ObjectMapper objectMapper;
    private final ConfigurableApplicationContext context;
    private final Path staticDataDir;

    private final BusinessRepository businessRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final GalleryItemRepository galleryItemRepository;
    private final TestimonialRepository testimonialRepository;
    private final FaqItemRepository faqItemRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final BusinessThemeRepository businessThemeRepository;
    private final SeoConfigRepository seoConfigRepository;
    private final BusinessSettingsRepository businessSettingsRepository;
    private final PageConfigRepository pageConfigRepository;

    public StaticDataImportRunner(
            ObjectMapper objectMapper,
            ConfigurableApplicationContext context,
            @Value("${app.import.static-data-dir:../static-data}") String staticDataDir,
            BusinessRepository businessRepository,
            ServiceItemRepository serviceItemRepository,
            GalleryItemRepository galleryItemRepository,
            TestimonialRepository testimonialRepository,
            FaqItemRepository faqItemRepository,
            TeamMemberRepository teamMemberRepository,
            BusinessThemeRepository businessThemeRepository,
            SeoConfigRepository seoConfigRepository,
            BusinessSettingsRepository businessSettingsRepository,
            PageConfigRepository pageConfigRepository) {
        this.objectMapper = objectMapper;
        this.context = context;
        this.staticDataDir = Path.of(staticDataDir);
        this.businessRepository = businessRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.galleryItemRepository = galleryItemRepository;
        this.testimonialRepository = testimonialRepository;
        this.faqItemRepository = faqItemRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.businessThemeRepository = businessThemeRepository;
        this.seoConfigRepository = seoConfigRepository;
        this.businessSettingsRepository = businessSettingsRepository;
        this.pageConfigRepository = pageConfigRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws IOException {
        log.info("Importing static data from {}", staticDataDir.toAbsolutePath());

        importBusinesses();
        importCollection("services.json", serviceItemRepository, ServiceItem::new);
        importCollection("gallery.json", galleryItemRepository, GalleryItem::new);
        importCollection("testimonials.json", testimonialRepository, Testimonial::new);
        importCollection("faq.json", faqItemRepository, FaqItem::new);
        importCollection("team.json", teamMemberRepository, TeamMember::new);
        importSingleton("theme.json", businessThemeRepository, BusinessTheme::new);
        importSingleton("seo.json", seoConfigRepository, SeoConfig::new);
        importSingleton("settings.json", businessSettingsRepository, BusinessSettings::new);
        importPages();

        log.info("Static data import complete.");
        System.exit(SpringApplication.exit(context, () -> 0));
    }

    private void importBusinesses() throws IOException {
        JsonNode index = readJson("businesses/index.json");
        for (JsonNode slugNode : index.get("slugs")) {
            String slug = slugNode.asString();
            JsonNode json = readJson("businesses/" + slug + ".json");
            Business entity =
                    businessRepository.findById(json.get("id").asString()).orElseGet(Business::new);
            entity.setId(json.get("id").asString());
            entity.setSlug(json.get("slug").asString());
            entity.setActive(!json.hasNonNull("isActive") || json.get("isActive").asBoolean());
            entity.setData(json.toString());
            businessRepository.save(entity);
        }
        log.info("Imported {} businesses", index.get("slugs").size());
    }

    private <T extends BusinessScopedContent> void importCollection(
            String fileName, BusinessScopedContentRepository<T> repository, Supplier<T> factory)
            throws IOException {
        JsonNode root = readJson(fileName);
        int count = 0;
        for (String businessId : root.propertyNames()) {
            for (JsonNode item : root.get(businessId)) {
                T entity = factory.get();
                entity.setId(item.get("id").asString());
                entity.setBusinessId(businessId);
                entity.setData(item.toString());
                repository.save(entity);
                count++;
            }
        }
        log.info("Imported {} records from {}", count, fileName);
    }

    private <T extends BusinessSingletonContent> void importSingleton(
            String fileName, org.springframework.data.jpa.repository.JpaRepository<T, String> repository,
            Supplier<T> factory) throws IOException {
        JsonNode root = readJson(fileName);
        int count = 0;
        for (String businessId : root.propertyNames()) {
            T entity = factory.get();
            entity.setBusinessId(businessId);
            entity.setData(root.get(businessId).toString());
            repository.save(entity);
            count++;
        }
        log.info("Imported {} records from {}", count, fileName);
    }

    private void importPages() throws IOException {
        JsonNode root = readJson("pages.json");
        int count = 0;
        for (String businessId : root.propertyNames()) {
            for (JsonNode item : root.get(businessId)) {
                String path = item.get("path").asString();
                PageConfig entity =
                        pageConfigRepository
                                .findByBusinessIdAndPath(businessId, path)
                                .orElseGet(PageConfig::new);
                if (entity.getId() == null) {
                    entity.setId(UUID.randomUUID());
                }
                entity.setBusinessId(businessId);
                entity.setPath(path);
                entity.setData(item.toString());
                pageConfigRepository.save(entity);
                count++;
            }
        }
        log.info("Imported {} records from pages.json", count);
    }

    private JsonNode readJson(String relativePath) throws IOException {
        Path path = staticDataDir.resolve(relativePath);
        return objectMapper.readTree(Files.readString(path));
    }
}
