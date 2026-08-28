package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.KdsOrderDTO;
import com.emirhan.day3.springboot.service.KdsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/kds")
public class KdsController {
    private final KdsService kdsService;

    public KdsController(KdsService kdsService) {
        this.kdsService = kdsService;
    }
    @GetMapping("/orders")
    public List<KdsOrderDTO> getAllOrders(){
        return kdsService.getAllOrders();
    }
}
