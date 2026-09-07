package com.rdplatforms.backend.booking;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByBusinessIdOrderByPreferredDateAscPreferredTimeAsc(String businessId);
}
