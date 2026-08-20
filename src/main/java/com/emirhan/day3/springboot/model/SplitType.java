package com.emirhan.day3.springboot.model;

// Bir order item'ın kişilere nasıl bölüştürüldüğünü belirtir.
// Kaydedilmiş tutarların (amount) yanında sadece "hangi yöntemle
// bölüştürüldü" bilgisini UI'ın modalı tekrar açtığında doğru
// sekmeyi seçebilmesi için tutuyoruz.
public enum SplitType {
    EQUAL,
    BY_QUANTITY,
    MANUAL
}
