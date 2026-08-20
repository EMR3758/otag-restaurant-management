package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense,Long> { }
