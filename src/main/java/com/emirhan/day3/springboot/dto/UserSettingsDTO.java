package com.emirhan.day3.springboot.dto;

public class UserSettingsDTO {
    private boolean emailNotifications;
    private boolean orderAlerts;
    private boolean systemUpdates;
    private boolean twoFactorEnabled;

    public UserSettingsDTO(){}
    public UserSettingsDTO(boolean emailNotifications,
                           boolean orderAlerts,
                           boolean systemUpdates,
                           boolean twoFactorEnabled) {
        this.emailNotifications = emailNotifications;
        this.orderAlerts = orderAlerts;
        this.systemUpdates = systemUpdates;
        this.twoFactorEnabled = twoFactorEnabled;
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
}
