package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.FinanceOverviewDTO;
import com.emirhan.day3.springboot.dto.FinanceChartDTO;
import com.emirhan.day3.springboot.model.*;
import com.emirhan.day3.springboot.repository.ExpenseRepository;
import com.emirhan.day3.springboot.repository.OrderRepository;
import com.emirhan.day3.springboot.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.LinkedHashMap;

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

        //Grafik için


        //
        double cardTotal = 0;
        double cashTotal=0;
        double otherTotal =0;
        for (Payment payment : payments) {

            if (payment.getMode() == PaymentMode.SINGLE) {

                PaymentMethod method = payment.getSinglePaymentMethod();
                double amount = payment.getOrder().getTotal();

                if (method == PaymentMethod.CARD) {
                    cardTotal += amount;
                } else if (method == PaymentMethod.CASH) {
                    cashTotal += amount;
                } else {
                    otherTotal += amount;
                }

            } else if (payment.getMode() == PaymentMode.GERMAN) {

                for (PaymentParticipant participant : payment.getParticipants()) {

                    PaymentMethod method = participant.getPaymentMethod();

                    for (PaymentAllocation allocation : participant.getAllocations()) {

                        double amount = allocation.getAmount();

                        if (method == PaymentMethod.CARD) {
                            cardTotal += amount;
                        } else if (method == PaymentMethod.CASH) {
                            cashTotal += amount;
                        } else {
                            otherTotal += amount;
                        }
                    }
                }
            }
        }
        List<FinanceOverviewDTO.PaymentMethodBreakdownDTO> paymentMethodBreakdown = List.of(

                createPaymentMethodBreakdown(
                        "CARD",
                        "Kredi Kartı",
                        "credit_card",
                        cardTotal
                ),

                createPaymentMethodBreakdown(
                        "CASH",
                        "Nakit",
                        "payments",
                        cashTotal
                ),

                createPaymentMethodBreakdown(
                        "OTHER",
                        "Diğer",
                        "account_balance",
                        otherTotal
                )

        );

        dto.setPaymentMethodBreakdown(paymentMethodBreakdown);

        return dto;
    }

    private FinanceOverviewDTO.PaymentMethodBreakdownDTO createPaymentMethodBreakdown(
            String method,
            String label,
            String icon,
            double amount
    ) {
        FinanceOverviewDTO.PaymentMethodBreakdownDTO dto =
                new FinanceOverviewDTO.PaymentMethodBreakdownDTO();

        dto.setMethod(method);
        dto.setLabel(label);
        dto.setIcon(icon);
        dto.setAmount(amount);

        return dto;
    }

    public FinanceChartDTO getFinanceChart(String period){
        LocalDate today = LocalDate.now();
        LocalDateTime start;
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        switch (period.toUpperCase()){
            case "DAILY":
                start = today.atStartOfDay();
                break;
            case "WEEKLY":
                start= today.minusDays(6).atStartOfDay();
                break;
            case "MONTHLY":
                start=today.withDayOfMonth(1).atStartOfDay();
                break;
            case "YEARLY":
                start=today.withDayOfYear(1).atStartOfDay();
                break;
            default:
                throw new IllegalArgumentException(
                        "Geçersiz grafik dönemi: " + period
                );
        }

        List<Payment> payments =
                paymentRepository.findByStatusAndCompletedAtBetween(
                        PaymentStatus.PAID,
                        start,
                        end
                );

        List<Expense> expenses = expenseRepository.findAll();

        List<String> labels = new ArrayList<>();
        List<Double> income = new ArrayList<>();
        List<Double> expense = new ArrayList<>();

        if(period.equalsIgnoreCase("WEEKLY")){
            for (int i = 0;i<7;i++){
                LocalDate date = today.minusDays(6-i);
                LocalDateTime dayStart = date.atStartOfDay();
                LocalDateTime dayEnd= date.plusDays(1).atStartOfDay();

                labels.add(
                        date.getDayOfWeek().getDisplayName(
                                java.time.format.TextStyle.SHORT,
                                java.util.Locale.forLanguageTag("tr-TR")
                        )
                );
                double dailyIncome = payments.stream()
                        .filter(p->p.getCompletedAt() != null && !p.getCompletedAt().isBefore(dayStart) && p.getCompletedAt().isBefore(dayEnd))
                        .map(Payment::getOrder)
                        .mapToDouble(Order::getTotal)
                        .sum();

                double dailyExpense = expenses.stream()
                        .filter(e-> !e.getDate().isBefore(dayStart) && e.getDate().isBefore(dayEnd))
                        .mapToDouble(Expense::getAmount)
                        .sum();

                income.add(dailyIncome);
                expense.add(dailyExpense);
            }

        }

        if(period.equalsIgnoreCase("DAILY")){
            labels.add("Bugün");
            double dailyIncome = payments.stream()
                    .filter(p->p.getCompletedAt() != null && !p.getCompletedAt().isBefore(start) && p.getCompletedAt().isBefore(end))
                    .map(Payment::getOrder)
                    .mapToDouble(Order::getTotal)
                    .sum();

            double dailyExpense = expenses.stream()
                    .filter(e->
                            !e.getDate().isBefore(start)&&e.getDate().isBefore(end))
                    .mapToDouble(Expense::getAmount)
                    .sum();

            income.add(dailyIncome);
            expense.add(dailyExpense);
        }

        if(period.equalsIgnoreCase("MONTHLY")){
            int daysInMonth = today.lengthOfMonth();
            for(int day =1;day<=daysInMonth;day++){
                LocalDate date = today.withDayOfMonth(day);
                LocalDateTime dayStart = date.atStartOfDay();
                LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();

                labels.add(String.valueOf(day));
                double dailyIncome = payments.stream()
                        .filter(p-> p.getCompletedAt() != null && !p.getCompletedAt().isBefore(dayStart)
                                && p.getCompletedAt().isBefore(dayEnd))
                        .map(Payment::getOrder)
                        .mapToDouble(Order::getTotal)
                        .sum();

                double dailyExpense = expenses.stream()
                        .filter(e->!e.getDate().isBefore(dayStart)&&e.getDate().isBefore(dayEnd))
                        .mapToDouble(Expense::getAmount)
                        .sum();

                income.add(dailyIncome);
                expense.add(dailyExpense);
            }
        }

        if(period.equalsIgnoreCase("YEARLY")){
            for (int month =1;month<=today.getMonthValue();month++){
                LocalDate monthStartDate = today.withMonth(month).withDayOfMonth(1);
                LocalDate monthEndDate = month == today.getMonthValue() ?  today.plusDays(1)
                        : monthStartDate.plusMonths(1);
                LocalDateTime monthStart = monthStartDate.atStartOfDay();
                LocalDateTime monthEnd = monthEndDate.atStartOfDay();

                labels.add(
                        monthStartDate.getMonth().getDisplayName(
                            TextStyle.SHORT,
                            java.util.Locale.forLanguageTag("tr-TR")
                        )
                );

                double monthlyIncome = payments.stream()
                        .filter(p ->
                                p.getCompletedAt() != null
                                        && !p.getCompletedAt().isBefore(monthStart)
                                        && p.getCompletedAt().isBefore(monthEnd)
                        )
                        .map(Payment::getOrder)
                        .mapToDouble(Order::getTotal)
                        .sum();

                double monthlyExpense = expenses.stream()
                        .filter(e ->
                                !e.getDate().isBefore(monthStart)
                                        && e.getDate().isBefore(monthEnd)
                        )
                        .mapToDouble(Expense::getAmount)
                        .sum();

                income.add(monthlyIncome);
                expense.add(monthlyExpense);
            }
        }

        return new FinanceChartDTO(
                labels,
                income,
                expense
        );
    }
}
