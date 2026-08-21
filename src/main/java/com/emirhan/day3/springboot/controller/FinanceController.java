package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.FinanceOverviewDTO;
import com.emirhan.day3.springboot.dto.FinanceChartDTO;
import com.emirhan.day3.springboot.service.FinanceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/overview")
    public FinanceOverviewDTO getFinanceOverview(){
        return financeService.getFinanceOverview();
    }

    @GetMapping("/chart")
    public FinanceChartDTO getFinanceChart(
            @RequestParam String period
    ) {
        return financeService.getFinanceChart(period);
    }
}
