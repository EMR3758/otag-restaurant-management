package com.emirhan.day3.springboot.dto;

import java.util.List;

public class FinanceOverviewDTO {
    private double dailyRevenue;
    private double monthlyRevenue;;
    private double dailyExpense;
    private double monthlyExpense;
    private double dailyNet;
    private double monthlyNet;
    private long orderCount;
    private double averageOrder;
    private List<PaymentMethodBreakdownDTO> paymentMethodBreakdown;


    public double getDailyRevenue() {
        return dailyRevenue;
    }

    public void setDailyRevenue(double dailyRevenue) {
        this.dailyRevenue = dailyRevenue;
    }

    public double getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(double monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public double getMonthlyExpense() {
        return monthlyExpense;
    }

    public void setMonthlyExpense(double monthlyExpense) {
        this.monthlyExpense = monthlyExpense;
    }

    public double getDailyExpense() {
        return dailyExpense;
    }

    public void setDailyExpense(double dailyExpense) {
        this.dailyExpense = dailyExpense;
    }

    public double getDailyNet() {
        return dailyNet;
    }

    public void setDailyNet(double dailyNet) {
        this.dailyNet = dailyNet;
    }

    public double getMonthlyNet() {
        return monthlyNet;
    }

    public void setMonthlyNet(double monthlyNet) {
        this.monthlyNet = monthlyNet;
    }

    public long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(long orderCount) {
        this.orderCount = orderCount;
    }

    public double getAverageOrder() {
        return averageOrder;
    }

    public void setAverageOrder(double averageOrder) {
        this.averageOrder = averageOrder;
    }

    public List<PaymentMethodBreakdownDTO> getPaymentMethodBreakdown() {
        return paymentMethodBreakdown;
    }

    public void setPaymentMethodBreakdown(List<PaymentMethodBreakdownDTO> paymentMethodBreakdown) {
        this.paymentMethodBreakdown = paymentMethodBreakdown;
    }

    public static class PaymentMethodBreakdownDTO {
        private String method;
        private String label;
        private String icon;
        private double amount;

        public String getMethod() {
            return method;
        }

        public void setMethod(String method) {
            this.method = method;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }
    }
}
