package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.StockDetails;
import com.emirhan.day3.springboot.model.Stock;
import com.emirhan.day3.springboot.model.StockUnit;
import com.emirhan.day3.springboot.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class StockService {
    private final StockRepository stockRepository;
    private final NotificationService notificationService;

    public StockService(StockRepository stockRepository,NotificationService notificationService) {
        this.stockRepository = stockRepository;
        this.notificationService=notificationService;
    }

    public List<Stock> getAllStocks(){
        return stockRepository.findAll();
    }

    public Stock getStockById(Long id){
        return stockRepository.findById(id).orElseThrow(()->new RuntimeException("Stok Bulunamadı."));
    }
    public Stock createStock(StockDetails stockDetails) {

        Stock stock = new Stock();

        stock.setProductName(stockDetails.getProductName());
        stock.setQuantity(stockDetails.getQuantity());
        stock.setMinimumQuantity(stockDetails.getMinimumQuantity());
        stock.setUnit(stockDetails.getUnit() != null ? stockDetails.getUnit() : StockUnit.ADET);

        return stockRepository.save(stock);
    }

    public Stock increaseStock(Long id, BigDecimal quantity) {
        Stock stock = getStockById(id);
        stock.setQuantity(stock.getQuantity().add(quantity));
        return stockRepository.save(stock);
    }

    public Stock decreaseStock(Long id,BigDecimal quantity){
        Stock stock = getStockById(id);
        if (stock.getQuantity().compareTo(quantity)<0){
            throw new RuntimeException("Yetersiz stok.");
        }
        stock.setQuantity(stock.getQuantity().subtract(quantity));
        Stock savedStock = stockRepository.save(stock);
        if (savedStock.getQuantity().compareTo(BigDecimal.ZERO) == 0){
            notificationService.createNotification(
                    1L,
                    "Stok Tükendi",
                    savedStock.getProductName() + " stoğu tükendi.",
                    "STOCK"
            );
        }else if (savedStock.getQuantity()
                .compareTo(savedStock.getMinimumQuantity()) <= 0) {
            notificationService.createNotification(
                    1L,
                    "Stok Azaldı",
                    savedStock.getProductName()
                            + " stoğu kritik seviyeye düştü.",
                    "STOCK"
            );
        }
        return savedStock;
    }

    public Stock findByProductName(String productName){
        return stockRepository.findByProductName(productName).orElseThrow(()->new RuntimeException(productName + " için stok bulunamadı."));
    }

    public void deleteStock(Long id) {
        Stock stock = getStockById(id);
        stockRepository.delete(stock);
    }
}


