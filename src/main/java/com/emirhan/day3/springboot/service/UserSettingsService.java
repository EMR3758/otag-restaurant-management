package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.UserSettingsDTO;
import com.emirhan.day3.springboot.model.User;
import com.emirhan.day3.springboot.model.UserSettings;
import com.emirhan.day3.springboot.repository.UserRepository;
import com.emirhan.day3.springboot.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;

import java.util.PrimitiveIterator;

@Service
public class UserSettingsService {
    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;

    public UserSettingsService(UserSettingsRepository userSettingsRepository, UserRepository userRepository) {
        this.userSettingsRepository = userSettingsRepository;
        this.userRepository = userRepository;
    }

    private UserSettingsDTO convertToDTO(UserSettings userSettings){
        User user = userSettings.getUser();
        return new UserSettingsDTO(
                userSettings.isEmailNotifications(),
                userSettings.isOrderAlerts(),
                userSettings.isSystemUpdates(),
                userSettings.isTwoFactorEnabled(),
                user.getFullName(),
                user.getPhone(),
                user.getEmail()
        );
    }

    private UserSettings createDefaultSettings(Long userId){
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Kullanıcı bulunamadı."));
        UserSettings settings = new UserSettings();
        settings.setUser(user);
        return userSettingsRepository.save(settings);
    }

    public UserSettingsDTO getSettings(Long userId){
        UserSettings settings = userSettingsRepository.findByUserId(userId).orElseGet(() -> createDefaultSettings(userId));
        return convertToDTO(settings);
    }

    public UserSettingsDTO updateSettings(Long userId,UserSettingsDTO dto){
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Kullanıcı bululnamadı."));
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        userRepository.save(user);

        UserSettings settings = userSettingsRepository
                .findByUserId(userId)
                .orElseGet(() -> createDefaultSettings(userId));
        settings.setEmailNotifications(dto.isEmailNotifications());
        settings.setOrderAlerts(dto.isOrderAlerts());
        settings.setSystemUpdates(dto.isSystemUpdates());
        settings.setTwoFactorEnabled(dto.isTwoFactorEnabled());
        UserSettings savedSettings = userSettingsRepository.save(settings);
        return convertToDTO(savedSettings);
    }
}
