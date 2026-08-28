package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.model.Expense;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ExpenseParser {

    private final ExpenseCategoryDetector categoryDetector;

    public ExpenseParser(ExpenseCategoryDetector categoryDetector) {
        this.categoryDetector = categoryDetector;
    }

    public List<Expense> parse(String ocrText) {

        List<Expense> expenses = new ArrayList<>();

        // Fatura/hizmet belgelerinde (elektrik, GSM, internet, kira vb.) tüm belge tek
        // kategoriye aittir. Ürün satırları içeren fişlerde (restaurant/market/manav) ise
        // her satırın kategorisi kendi ürün adına göre ayrı ayrı belirlenir.
        DocumentType documentType = categoryDetector.detectDocumentType(ocrText);

        String documentCategory = documentType == DocumentType.INVOICE
                ? categoryDetector.detectCategory(ocrText)
                : null;

        Pattern amountPattern =
                Pattern.compile("\\d+(?:\\.\\d{3})*,\\d{2}");

        Pattern quantityPattern =
                Pattern.compile("\\b(\\d+)\\s*(ADET|KG|KİLO|L|LT|LİTRE)\\b",
                        Pattern.CASE_INSENSITIVE);

        String[] lines = ocrText.split("\\r?\\n");

        Pattern datePattern = Pattern.compile("\\b\\d{2}[./-]\\d{2}[./-]\\d{4}\\b");

        for (String line : lines) {

            line = line.trim();

            if (line.isEmpty()) {
                continue;
            }

            Matcher dateMatcher = datePattern.matcher(line);

            if(dateMatcher.find()){
                String dateText = dateMatcher.group();

                dateText = dateText.replace("/", ".")
                        .replace("-", ".");
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
                LocalDate date = LocalDate.parse(dateText,formatter);
                System.out.println("Tarih: "+date);
            }



            Matcher amountMatcher = amountPattern.matcher(line);

            if (amountMatcher.find()) {

                String amountText = amountMatcher.group();

                amountText = amountText.replace(".", "");
                amountText = amountText.replace(",", ".");

                double amount = Double.parseDouble(amountText);

                String name = line
                        .replace(amountMatcher.group(), "")
                        .replace("*", "")
                        .trim();

                Matcher quantityMatcher = quantityPattern.matcher(name);

                double quantity = 0;
                String unit = null;

                if (quantityMatcher.find()) {

                    quantity = Double.parseDouble(quantityMatcher.group(1));
                    unit = quantityMatcher.group(2);

                    System.out.println("Miktar: " + quantity);
                    System.out.println("Birim: " + unit);
                }

                name = name.replaceAll("\\s*\\d+\\s*A?DET\\s*\\d*\\s*$", "");
                name = name.replaceAll("\\s*A?DET\\s*$", "");
                name = name.trim();

                String category = documentType == DocumentType.INVOICE
                        ? documentCategory
                        : categoryDetector.detectLineItemCategory(name);

                Expense expense = new Expense();

                expense.setAmount(amount);
                expense.setName(name);
                expense.setQuantity(quantity);
                expense.setUnit(unit);
                expense.setCategory(category);

                expenses.add(expense);

                System.out.println("Tutar: " + amount);
                System.out.println("Gider adı: " + name);
            }
        }

        return expenses;
    }
}