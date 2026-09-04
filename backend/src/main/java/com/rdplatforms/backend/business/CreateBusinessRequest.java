package com.rdplatforms.backend.business;

public record CreateBusinessRequest(
        String slug, String displayName, String legalName, String category, String phone) {}
