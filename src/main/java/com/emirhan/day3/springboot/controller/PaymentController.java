package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.*;
import com.emirhan.day3.springboot.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders/{orderId}/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public PaymentDTO getPayment(@PathVariable Long orderId) {
        return paymentService.getPaymentState(orderId);
    }

    @PutMapping("/mode")
    public PaymentDTO updateMode(@PathVariable Long orderId, @RequestBody UpdatePaymentModeRequestDTO dto) {
        return paymentService.updateMode(orderId, dto.getMode());
    }

    @PutMapping("/method")
    public PaymentDTO updateSingleMethod(@PathVariable Long orderId, @RequestBody UpdatePaymentMethodRequestDTO dto) {
        return paymentService.updateSingleMethod(orderId, dto.getMethod());
    }

    @PostMapping("/participants")
    public PaymentDTO addParticipant(@PathVariable Long orderId, @RequestBody AddParticipantRequestDTO dto) {
        return paymentService.addParticipant(orderId, dto.getName());
    }

    @DeleteMapping("/participants/{participantId}")
    public PaymentDTO removeParticipant(@PathVariable Long orderId, @PathVariable Long participantId) {
        return paymentService.removeParticipant(orderId, participantId);
    }

    @PutMapping("/participants/{participantId}/method")
    public PaymentDTO updateParticipantMethod(@PathVariable Long orderId,
                                               @PathVariable Long participantId,
                                               @RequestBody UpdatePaymentMethodRequestDTO dto) {
        return paymentService.updateParticipantMethod(orderId, participantId, dto.getMethod());
    }

    @PutMapping("/items/{orderItemId}/allocations")
    public PaymentDTO saveItemAllocations(@PathVariable Long orderId,
                                           @PathVariable Long orderItemId,
                                           @RequestBody SaveItemAllocationsRequestDTO dto) {
        return paymentService.saveItemAllocations(orderId, orderItemId, dto);
    }

    @PostMapping("/complete")
    public PaymentDTO completePayment(@PathVariable Long orderId) {
        return paymentService.completePayment(orderId);
    }
}
