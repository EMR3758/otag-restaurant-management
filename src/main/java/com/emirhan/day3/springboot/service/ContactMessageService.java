package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.ContactMessageCreateDTO;
import com.emirhan.day3.springboot.exception.ContactMessageValidationException;
import com.emirhan.day3.springboot.model.ContactMessage;
import com.emirhan.day3.springboot.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactMessageService {

    // OrderService/StockService'te bildirimler için kullanılan aynı sabit
    // admin userId (bkz. NotificationsContext.jsx'teki userId=1 ile eşleşir).
    private static final Long ADMIN_USER_ID = 1L;

    private final ContactMessageRepository contactMessageRepository;
    private final NotificationService notificationService;

    public ContactMessageService(ContactMessageRepository contactMessageRepository,
                                  NotificationService notificationService) {
        this.contactMessageRepository = contactMessageRepository;
        this.notificationService = notificationService;
    }

    public ContactMessage create(ContactMessageCreateDTO dto) {
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new ContactMessageValidationException("Ad Soyad boş olamaz");
        }
        if (dto.getEmail() == null || dto.getEmail().isBlank() || !dto.getEmail().contains("@")) {
            throw new ContactMessageValidationException("Geçerli bir e-posta adresi giriniz");
        }
        if (dto.getMessage() == null || dto.getMessage().isBlank()) {
            throw new ContactMessageValidationException("Mesaj boş olamaz");
        }

        ContactMessage contactMessage = new ContactMessage(
                dto.getName().trim(),
                dto.getEmail().trim(),
                dto.getMessage().trim()
        );
        ContactMessage saved = contactMessageRepository.save(contactMessage);

        notificationService.createNotification(
                ADMIN_USER_ID,
                "Yeni İletişim Mesajı",
                saved.getName() + " (" + saved.getEmail() + "): " + saved.getMessage(),
                "CONTACT"
        );

        return saved;
    }
}
