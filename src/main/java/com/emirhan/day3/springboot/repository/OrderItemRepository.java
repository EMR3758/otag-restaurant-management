package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository  extends JpaRepository<OrderItem,Long> {

    List<OrderItem> findByOrder_Id(Long orderId);

    // Bir siparişe ait bütün OrderItem'ları siler.
    // Order silinmeden önce çağrılır, aksi halde order_item tablosundaki
    // order_id foreign key kısıtlaması (FK constraint) nedeniyle
    // orders satırı silinemez (DataIntegrityViolationException).
    void deleteByOrder_Id(Long orderId);
}
