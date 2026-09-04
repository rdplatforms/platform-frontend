package com.rdplatforms.backend.content;

import java.util.List;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Parses an entity's raw {@code data} JSON back into a {@link JsonNode}
 * so controllers can return it directly — Spring's Jackson message
 * converter serializes a JsonNode tree as real JSON with no re-modeling
 * step, preserving field-for-field fidelity with the original record.
 */
@Component
public class JsonPayloads {

    private final ObjectMapper objectMapper;

    public JsonPayloads(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public JsonNode toNode(HasJsonData entity) {
        return objectMapper.readTree(entity.getData());
    }

    public List<JsonNode> toNodeList(List<? extends HasJsonData> entities) {
        return entities.stream().map(this::toNode).toList();
    }
}
