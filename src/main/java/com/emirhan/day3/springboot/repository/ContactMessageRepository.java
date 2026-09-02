package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}
