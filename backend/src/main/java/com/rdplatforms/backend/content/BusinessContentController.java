package com.rdplatforms.backend.content;

import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.JsonNode;

/**
 * Every /businesses/{businessId}/... read endpoint from
 * docs/future-backend-contract.md, TASK-004.
 */
@RestController
@RequestMapping("/businesses/{businessId}")
public class BusinessContentController {

    private final ServiceItemRepository serviceItemRepository;
    private final GalleryItemRepository galleryItemRepository;
    private final TestimonialRepository testimonialRepository;
    private final FaqItemRepository faqItemRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final BusinessThemeRepository businessThemeRepository;
    private final SeoConfigRepository seoConfigRepository;
    private final BusinessSettingsRepository businessSettingsRepository;
    private final PageConfigRepository pageConfigRepository;
    private final JsonPayloads jsonPayloads;

    public BusinessContentController(
            ServiceItemRepository serviceItemRepository,
            GalleryItemRepository galleryItemRepository,
            TestimonialRepository testimonialRepository,
            FaqItemRepository faqItemRepository,
            TeamMemberRepository teamMemberRepository,
            BusinessThemeRepository businessThemeRepository,
            SeoConfigRepository seoConfigRepository,
            BusinessSettingsRepository businessSettingsRepository,
            PageConfigRepository pageConfigRepository,
            JsonPayloads jsonPayloads) {
        this.serviceItemRepository = serviceItemRepository;
        this.galleryItemRepository = galleryItemRepository;
        this.testimonialRepository = testimonialRepository;
        this.faqItemRepository = faqItemRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.businessThemeRepository = businessThemeRepository;
        this.seoConfigRepository = seoConfigRepository;
        this.businessSettingsRepository = businessSettingsRepository;
        this.pageConfigRepository = pageConfigRepository;
        this.jsonPayloads = jsonPayloads;
    }

    @GetMapping("/services")
    public List<JsonNode> services(@PathVariable String businessId) {
        return jsonPayloads.toNodeList(serviceItemRepository.findByBusinessId(businessId));
    }

    @GetMapping("/gallery")
    public List<JsonNode> gallery(@PathVariable String businessId) {
        return jsonPayloads.toNodeList(galleryItemRepository.findByBusinessId(businessId));
    }

    @GetMapping("/testimonials")
    public List<JsonNode> testimonials(@PathVariable String businessId) {
        return jsonPayloads.toNodeList(testimonialRepository.findByBusinessId(businessId));
    }

    @GetMapping("/faqs")
    public List<JsonNode> faqs(@PathVariable String businessId) {
        return jsonPayloads.toNodeList(faqItemRepository.findByBusinessId(businessId));
    }

    @GetMapping("/team")
    public List<JsonNode> team(@PathVariable String businessId) {
        return jsonPayloads.toNodeList(teamMemberRepository.findByBusinessId(businessId));
    }

    @GetMapping("/theme")
    public ResponseEntity<JsonNode> theme(@PathVariable String businessId) {
        return orNotFound(businessThemeRepository.findById(businessId));
    }

    @GetMapping("/seo")
    public ResponseEntity<JsonNode> seo(@PathVariable String businessId) {
        return orNotFound(seoConfigRepository.findById(businessId));
    }

    @GetMapping("/settings")
    public ResponseEntity<JsonNode> settings(@PathVariable String businessId) {
        return orNotFound(businessSettingsRepository.findById(businessId));
    }

    @GetMapping("/pages")
    public List<JsonNode> pages(@PathVariable String businessId) {
        return jsonPayloads.toNodeList(pageConfigRepository.findByBusinessId(businessId));
    }

    @GetMapping("/pages/by-path")
    public ResponseEntity<JsonNode> pageByPath(
            @PathVariable String businessId, @RequestParam String path) {
        return orNotFound(pageConfigRepository.findByBusinessIdAndPath(businessId, path));
    }

    private ResponseEntity<JsonNode> orNotFound(Optional<? extends HasJsonData> entity) {
        return entity
                .map(jsonPayloads::toNode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
