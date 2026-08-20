package com.emirhan.day3.springboot.dto;

public class UserSettingsDTO {
    private String fullName;
    private String email;
    private String phone;

    private boolean emailNotifications;
    private boolean orderAlerts;
    private boolean systemUpdates;
    private boolean twoFactorEnabled;

    public UserSettingsDTO(){}
    public UserSettingsDTO(boolean emailNotifications,
                           boolean orderAlerts,
                           boolean systemUpdates,
                           boolean twoFactorEnabled,
                           String fullName,
                           String email,
                           String phone) {
        this.emailNotifications = emailNotifications;
        this.orderAlerts = orderAlerts;
        this.systemUpdates = systemUpdates;
        this.twoFactorEnabled = twoFactorEnabled;
        this.fullName=fullName;
        this.email=email;
        this.phone=phone;
    }

    public boolean isEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public boolean isOrderAlerts() {
        return orderAlerts;
    }

    public void setOrderAlerts(boolean orderAlerts) {
        this.orderAlerts = orderAlerts;
    }

    public boolean isSystemUpdates() {
        return systemUpdates;
    }

    public void setSystemUpdates(boolean systemUpdates) {
        this.systemUpdates = systemUpdates;
    }

    public boolean isTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
