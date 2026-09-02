package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.ContactMessageCreateDTO;
import com.emirhan.day3.springboot.model.ContactMessage;
import com.emirhan.day3.springboot.service.ContactMessageService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Sadece müşterinin (site) iletişim formundan yeni mesaj gönderebilmesi için
// tek bir public POST endpoint'i (bkz. SecurityConfig). Mesajları listeleme/
// yönetme burada yok; admin tarafı mevcut /notifications sistemi üzerinden
// (JWT korumalı) görünür (bkz. ContactMessageService.create).
@RestController
@RequestMapping("/contact-messages")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @PostMapping
    public ContactMessage createContactMessage(@RequestBody ContactMessageCreateDTO dto) {
        return contactMessageService.create(dto);
    }
}
