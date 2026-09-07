package com.rdplatforms.backend.booking;

import com.rdplatforms.backend.auth.AuthenticatedUser;
import com.rdplatforms.backend.business.BusinessRepository;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * One endpoint serves both the public website's Appointment form (no
 * auth — TASK-014) and apps/portal's "add a walk-in/phone-in booking"
 * (TASK-015), distinguished by whether a valid Owner/Staff/Super Admin
 * token is present: unauthenticated always creates
 * source=ONLINE/status=PENDING (never trusts a client-supplied source
 * or status — SecurityConfig makes POST here public specifically so a
 * logged-out customer can call it, so nothing in the request body
 * itself can be trusted to say who's calling); an authenticated
 * member of this business creates source=STAFF/status=CONFIRMED
 * directly, since a staff-entered walk-in isn't "pending" anything.
 *
 * Listing and status updates require being a member of this specific
 * business (or Super Admin) — see AuthenticatedUser.canAccessBusiness.
 */
@RestController
@RequestMapping("/businesses/{businessId}/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final BusinessRepository businessRepository;

    public BookingController(BookingRepository bookingRepository, BusinessRepository businessRepository) {
        this.bookingRepository = bookingRepository;
        this.businessRepository = businessRepository;
    }

    @PostMapping
    public ResponseEntity<?> create(
            @AuthenticationPrincipal AuthenticatedUser actor,
            @PathVariable String businessId,
            @RequestBody CreateBookingRequest request) {
        if (businessRepository.findById(businessId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        boolean isStaffBooking = actor != null && actor.canAccessBusiness(businessId);

        Booking booking = new Booking();
        booking.setBusinessId(businessId);
        booking.setServiceId(request.serviceId());
        booking.setCustomerName(request.customerName());
        booking.setPreferredDate(request.preferredDate());
        booking.setPreferredTime(request.preferredTime());
        booking.setNote(request.note());
        booking.setSource(isStaffBooking ? BookingSource.STAFF : BookingSource.ONLINE);
        booking.setStatus(isStaffBooking ? BookingStatus.CONFIRMED : BookingStatus.PENDING);

        return ResponseEntity.status(HttpStatus.CREATED).body(bookingRepository.save(booking));
    }

    @GetMapping
    public ResponseEntity<?> list(
            @AuthenticationPrincipal AuthenticatedUser actor, @PathVariable String businessId) {
        ResponseEntity<?> forbidden = requireMember(actor, businessId);
        if (forbidden != null) {
            return forbidden;
        }
        return ResponseEntity.ok(
                bookingRepository.findByBusinessIdOrderByPreferredDateAscPreferredTimeAsc(businessId));
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<?> updateStatus(
            @AuthenticationPrincipal AuthenticatedUser actor,
            @PathVariable String businessId,
            @PathVariable UUID bookingId,
            @RequestBody UpdateBookingStatusRequest request) {
        ResponseEntity<?> forbidden = requireMember(actor, businessId);
        if (forbidden != null) {
            return forbidden;
        }
        return bookingRepository
                .findById(bookingId)
                .filter(b -> b.getBusinessId().equals(businessId))
                .map(
                        booking -> {
                            booking.setStatus(request.status());
                            return ResponseEntity.ok(bookingRepository.save(booking));
                        })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private ResponseEntity<?> requireMember(AuthenticatedUser actor, String businessId) {
        if (actor == null || !actor.canAccessBusiness(businessId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Must be a member of this business"));
        }
        return null;
    }
}
