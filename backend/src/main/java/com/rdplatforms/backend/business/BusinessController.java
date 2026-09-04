package com.rdplatforms.backend.business;

import com.rdplatforms.backend.content.JsonPayloads;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.JsonNode;

/** Matches the surface in docs/future-backend-contract.md, TASK-004. */
@RestController
@RequestMapping("/businesses")
public class BusinessController {

    private final BusinessRepository businessRepository;
    private final JsonPayloads jsonPayloads;

    public BusinessController(BusinessRepository businessRepository, JsonPayloads jsonPayloads) {
        this.businessRepository = businessRepository;
        this.jsonPayloads = jsonPayloads;
    }

    @GetMapping
    public List<JsonNode> listBusinesses() {
        return jsonPayloads.toNodeList(businessRepository.findAll());
    }

    @GetMapping("/by-slug/{slug}")
    public ResponseEntity<JsonNode> getBySlug(@PathVariable String slug) {
        return businessRepository
                .findBySlug(slug)
                .map(jsonPayloads::toNode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
