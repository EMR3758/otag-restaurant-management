package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.model.Notification;
import com.emirhan.day3.springboot.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam Long userId){
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@RequestParam Long userId){
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }
    @GetMapping("/unread/count")
    public ResponseEntity<Long>getUnreadCount(@RequestParam Long userId){
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long notificationId, @RequestParam Long userId) {
        return ResponseEntity.ok(notificationService.markAsRead(notificationId, userId));
    }
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@RequestParam Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
}
