package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.ExpenseRequestDTO;
import com.emirhan.day3.springboot.dto.ExpenseResponseDTO;
import com.emirhan.day3.springboot.model.Expense;
import com.emirhan.day3.springboot.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public ExpenseResponseDTO convertToResponseDTO(Expense expense){
        ExpenseResponseDTO responseDTO = new ExpenseResponseDTO();

        responseDTO.setId(expense.getId());
        responseDTO.setName(expense.getName());
        responseDTO.setCategory(expense.getCategory());
        responseDTO.setAmount(expense.getAmount());
        responseDTO.setPaymentMethod(expense.getPaymentMethod());
        responseDTO.setDate(expense.getDate());
        responseDTO.setDescription(expense.getDescription());

        return responseDTO;
    }

    public ExpenseResponseDTO createExpense(ExpenseRequestDTO expenseRequestDTO){
        Expense expense = new Expense();
        expense.setName(expenseRequestDTO.getName());
        expense.setCategory(expenseRequestDTO.getCategory());
        expense.setAmount(expenseRequestDTO.getAmount());
        expense.setPaymentMethod(expenseRequestDTO.getPaymentMethod());
        expense.setDate(expenseRequestDTO.getDate());
        expense.setDescription(expense.getDescription());
        Expense savedExpense = expenseRepository.save(expense);
        return convertToResponseDTO(savedExpense);
    }

    public List<ExpenseResponseDTO> getAllExpenses(){
        return expenseRepository.findAll().stream().map(this::convertToResponseDTO).toList();
    }

    public ExpenseResponseDTO getExpenseById(Long id){
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));

        return convertToResponseDTO(expense);
    }

    public ExpenseResponseDTO updateExpense(Long id,ExpenseRequestDTO expenseRequestDTO){
        Expense expense = expenseRepository.findById(id).orElseThrow(()-> new RuntimeException("Expense not found with id: "+ id));
        expense.setName(expenseRequestDTO.getName());
        expense.setCategory(expenseRequestDTO.getCategory());
        expense.setAmount(expenseRequestDTO.getAmount());
        expense.setPaymentMethod(expenseRequestDTO.getPaymentMethod());
        expense.setDate(expenseRequestDTO.getDate());
        expense.setDescription(expenseRequestDTO.getDescription());

        Expense updatedExpense = expenseRepository.save(expense);
        return convertToResponseDTO(updatedExpense);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }
}
