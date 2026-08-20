package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.Reservation;
import com.emirhan.day3.springboot.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByReservationDate(LocalDate reservationDate);

    List<Reservation> findByTable_Id(Long tableId);

    List<Reservation> findByStatus(ReservationStatus status);

    // Çakışma kontrolü: aynı masa + aynı tarih + aynı saatte, verilen
    // status'lerden birine sahip başka bir rezervasyon var mı?
    List<Reservation> findByTable_IdAndReservationDateAndReservationTimeAndStatusIn(
            Long tableId,
            LocalDate reservationDate,
            LocalTime reservationTime,
            List<ReservationStatus> statuses
    );
}
