package com.emirhan.day3.springboot.model;

import jakarta.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean active = true;
    private String phone ;

    @Column(nullable = false)
    private Boolean emailNotifications = false;

    @Column(nullable = false)
    private Boolean orderAlerts = false;

    @Column(nullable = false)
    private Boolean systemUpdates = false;

    @Column(nullable = false)
    private Boolean twoFactorEnabled = false;

    public User() {
    }

    public User(String fullName,
                String email,
                String password,
                Role role,
                boolean active,
                String phone,
                Boolean emailNotifications,
                Boolean orderAlerts,
                Boolean systemUpdates,
                Boolean twoFactorEnabled) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active=active;
        this.phone=phone;
        this.emailNotifications=emailNotifications;
        this.orderAlerts=orderAlerts;
        this.systemUpdates=systemUpdates;
        this.twoFactorEnabled=twoFactorEnabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public Boolean getOrderAlerts() {
        return orderAlerts;
    }

    public void setOrderAlerts(Boolean orderAlerts) {
        this.orderAlerts = orderAlerts;
    }

    public Boolean getSystemUpdates() {
        return systemUpdates;
    }

    public void setSystemUpdates(Boolean systemUpdates) {
        this.systemUpdates = systemUpdates;
    }

    public Boolean getTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(Boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }
}
