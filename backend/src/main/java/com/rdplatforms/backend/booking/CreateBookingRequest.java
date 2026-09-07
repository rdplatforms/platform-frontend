package com.rdplatforms.backend.booking;

import java.time.LocalDate;

public record CreateBookingRequest(
        String serviceId, String customerName, LocalDate preferredDate, String preferredTime, String note) {}
