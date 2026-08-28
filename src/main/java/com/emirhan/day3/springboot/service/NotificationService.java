package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.model.Notification;
import com.emirhan.day3.springboot.repository.NotificationRepository;
import org.aspectj.weaver.ast.Not;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    public Notification createNotification(Long userId,String title,String message,String type){
        Notification notification = new Notification(userId,title,message,type);
        return notificationRepository.save(notification);
    }
    public List<Notification> getUserNotifications(Long userId){
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    public Notification markAsRead(Long notificationId,Long userId){
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(()-> new RuntimeException("Bildirim bulunamadı."));
        if(!notification.getUserId().equals(userId)){
            throw new RuntimeException(
                    "Bu bildirime erişim yetkiniz yok."
            );
        }
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
    public void markAllAsRead(Long userId) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
            }
        }

        notificationRepository.saveAll(notifications);
    }


}
