package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.StockDetails;
import com.emirhan.day3.springboot.model.Stock;
import com.emirhan.day3.springboot.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }
    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks(){
        return ResponseEntity.ok(stockService.getAllStocks());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable Long id){
        return ResponseEntity.ok(stockService.getStockById(id));
    }
    @PostMapping
    public ResponseEntity<Stock> createStock(@RequestBody StockDetails stockDetails){
        return ResponseEntity.ok(stockService.createStock(stockDetails));
    }
    @PutMapping("/{id}/increase")
    public ResponseEntity<Stock> increaseStock(@PathVariable Long id, @RequestParam BigDecimal quantity) {
        return ResponseEntity.ok(stockService.increaseStock(id, quantity));
    }
    @PutMapping("/{id}/decrease")
    public ResponseEntity<Stock> decreaseStock(@PathVariable Long id,@RequestParam BigDecimal quantity){
        return ResponseEntity.ok(stockService.decreaseStock(id, quantity));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }
}
