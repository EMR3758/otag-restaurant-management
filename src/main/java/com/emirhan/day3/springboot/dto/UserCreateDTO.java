package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.Role;

public class UserCreateDTO {
    private String fullName;
    private String email;
    private String password;
    private Role role;
    private boolean active;
    private String phone;

    public UserCreateDTO(){}
    public UserCreateDTO(String fullName, String email, String password, Role role,boolean active,String phone) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = active;
        this.phone=phone;
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
}
