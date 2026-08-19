package com.emirhan.day3.springboot.dto;

public class AuthResponse {

    private String token;

    // Frontend'in "Personel Ekle"/düzenle/sil gibi butonları role göre
    // gösterip gizleyebilmesi için login yanıtına rol bilgisini de ekliyoruz.
    // Asıl yetkilendirme yine backend'de (SecurityConfig/UserService)
    // yapılıyor; bu alan sadece arayüz görünürlüğü içindir.
    private String role;

    public AuthResponse() {
    }

    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}