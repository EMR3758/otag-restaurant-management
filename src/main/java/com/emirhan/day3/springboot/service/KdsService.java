package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.KdsOrderDTO;
import com.emirhan.day3.springboot.dto.KdsOrderItemDTO;
import com.emirhan.day3.springboot.model.Order;
import com.emirhan.day3.springboot.model.OrderItem;
import com.emirhan.day3.springboot.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class KdsService {
    private final OrderItemRepository orderItemRepository;

    public KdsService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public List<KdsOrderDTO> getAllOrders(){
        List<OrderItem> orderItems = orderItemRepository.findAll();
        Map<Long, KdsOrderDTO> orderMap = new LinkedHashMap<>();

        for(OrderItem orderItem : orderItems){
            Order order = orderItem.getOrder();
            Long orderId = order.getId();
            KdsOrderDTO kdsOrder = orderMap.get(orderId);

            String tableNumber;
            if (order.getTable() != null){
                tableNumber = order.getTable().getTableNumber();
            }else {
                tableNumber ="Dışarıdan Sipariş";
            }

            if (kdsOrder == null){
                kdsOrder = new KdsOrderDTO(
                        order.getId(),
                        tableNumber,
                        order.getOrderDate(),
                        new ArrayList<>()
                );
                orderMap.put(orderId,kdsOrder);
            }
            KdsOrderItemDTO itemDTO = new KdsOrderItemDTO(
                    orderItem.getId(),
                    orderItem.getProduct().getName(),
                    orderItem.getStation(),
                    orderItem.getQuantity(),
                    orderItem.getNote(),
                    orderItem.getStatus()
            );

            kdsOrder.getItems().add(itemDTO);

        }
        return new ArrayList<>(orderMap.values());
    }
}
