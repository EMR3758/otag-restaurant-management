package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.ReservationCreateDTO;
import com.emirhan.day3.springboot.dto.ReservationResponseDTO;
import com.emirhan.day3.springboot.dto.ReservationStatusUpdateDTO;
import com.emirhan.day3.springboot.dto.ReservationUpdateDTO;
import com.emirhan.day3.springboot.service.ReservationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<ReservationResponseDTO> getAllReservations() {
        return reservationService.getAll();
    }

    @GetMapping("/{id}")
    public ReservationResponseDTO getReservationById(@PathVariable Long id) {
        return reservationService.getById(id);
    }

    @GetMapping("/date/{date}")
    public List<ReservationResponseDTO> getReservationsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return reservationService.getByDate(date);
    }

    @PostMapping
    public ReservationResponseDTO createReservation(@RequestBody ReservationCreateDTO dto) {
        return reservationService.create(dto);
    }

    @PutMapping("/{id}")
    public ReservationResponseDTO updateReservation(@PathVariable Long id, @RequestBody ReservationUpdateDTO dto) {
        return reservationService.update(id, dto);
    }

    @PatchMapping("/{id}/status")
    public ReservationResponseDTO updateReservationStatus(@PathVariable Long id, @RequestBody ReservationStatusUpdateDTO dto) {
        return reservationService.updateStatus(id, dto.getStatus());
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.delete(id);
    }
}
