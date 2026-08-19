package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.UserSettingsDTO;
import com.emirhan.day3.springboot.service.UserSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserSettingsController {
    private final UserSettingsService userSettingsService;
    public UserSettingsController(UserSettingsService userSettingsService) {
        this.userSettingsService = userSettingsService;
    }

    @GetMapping("/{userId}/settings")
    public ResponseEntity<UserSettingsDTO> getSettings(@PathVariable Long userId){
        return ResponseEntity.ok(userSettingsService.getSettings(userId));
    }
    @PutMapping("/{userId}/settings")
    public ResponseEntity<UserSettingsDTO> updateSettings(@PathVariable Long userId,@RequestBody UserSettingsDTO dto){
        return ResponseEntity.ok(userSettingsService.updateSettings(userId,dto));
    }

}
