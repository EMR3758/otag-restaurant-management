package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.FinanceOverviewDTO;
import com.emirhan.day3.springboot.model.*;
import com.emirhan.day3.springboot.repository.ExpenseRepository;
import com.emirhan.day3.springboot.repository.OrderRepository;
import com.emirhan.day3.springboot.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FinanceService {
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ExpenseRepository expenseRepository;

    public FinanceService(OrderRepository orderRepository, PaymentRepository paymentRepository, ExpenseRepository expenseRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.expenseRepository = expenseRepository;
    }

    public FinanceOverviewDTO getFinanceOverview() {

        FinanceOverviewDTO dto = new FinanceOverviewDTO();


        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();
        List<Payment> payments =
                paymentRepository.findByStatusAndCompletedAtBetween(
                        PaymentStatus.PAID,
                        start,
                        end
                );
        //Günlük Ciro
        double dailyRevenue = payments.stream()
                        .map(Payment::getOrder)
                                .mapToLong(Order::getTotal)
                                        .sum();
        dto.setDailyRevenue(dailyRevenue);
        //Günlük Gider
        List<Expense> expenses = expenseRepository.findAll();
        double dailyExpense = expenses.stream().filter(expense -> !expense.getDate().isBefore(start) && expense.getDate().isBefore(end)).mapToDouble(Expense::getAmount).sum();
        dto.setDailyExpense(dailyExpense);

        //Aylık Gelir
        LocalDateTime monthStart = today.withDayOfMonth(1).atStartOfDay();
        List<Payment> monthlyPayments = paymentRepository.findByStatusAndCompletedAtBetween(PaymentStatus.PAID,monthStart,end);
        double monthlyRevenue = monthlyPayments.stream().map(Payment::getOrder).mapToLong(Order::getTotal).sum();
        dto.setMonthlyRevenue(monthlyRevenue);

        //Aylık Gider
        double monthlyExpense = expenses.stream()
                .filter(expense -> !expense.getDate().isBefore(monthStart)
                        && expense.getDate().isBefore(end))
                .mapToDouble(Expense::getAmount)
                .sum();

        dto.setMonthlyExpense(monthlyExpense);

        //Net Günlük - Aylık
        double dailyNet = dailyRevenue - dailyExpense;
        dto.setDailyNet(dailyNet);
        double monthlyNet = monthlyRevenue - monthlyExpense;
        dto.setMonthlyNet(monthlyNet);

        //Bugünkü Tamamlanan Sipariş Sayısı
        List<Order> orders = orderRepository.findAll();
        long orderCount = orders.stream().filter(order -> !order.getOrderDate().isBefore(start)
                && order.getOrderDate().isBefore(end)).filter(order -> order.getStatus() == OrderStatus.DELIVERED).count();
        dto.setOrderCount(orderCount);


        return dto;
    }
}
