package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.model.Expense;
import com.emirhan.day3.springboot.service.ExpenseParser;
import com.emirhan.day3.springboot.service.OcrService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ocr")
public class OcrController {

    private final OcrService ocrService;
    private final ExpenseParser expenseParser;

    public OcrController(OcrService ocrService, ExpenseParser expenseParser) {
        this.ocrService = ocrService;
        this.expenseParser = expenseParser;
    }

    @PostMapping(
            value = "/receipt",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Map<String, Object> readReceipt(
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        String text = ocrService.extractText(file);

        List<Expense> expenses = expenseParser.parse(text);

        return Map.of(
                "text", text,
                "expenses", expenses
        );
    }
}