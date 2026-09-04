package com.rdplatforms.backend.auth;

public record CreateStaffRequest(
        String email, String password, String displayName, boolean canViewFullAnalytics) {}
