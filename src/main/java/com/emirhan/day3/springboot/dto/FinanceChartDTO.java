package com.emirhan.day3.springboot.dto;

import java.util.List;

public class FinanceChartDTO {
    private List<String> labels;
    private List<Double> income;
    private List<Double> expense;

    public FinanceChartDTO(){}
    public FinanceChartDTO(List<String> labels, List<Double> income, List<Double> expense) {
        this.labels = labels;
        this.income = income;
        this.expense = expense;
    }

    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<Double> getIncome() {
        return income;
    }

    public void setIncome(List<Double> income) {
        this.income = income;
    }

    public List<Double> getExpense() {
        return expense;
    }

    public void setExpense(List<Double> expense) {
        this.expense = expense;
    }
}
