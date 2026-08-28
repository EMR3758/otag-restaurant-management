package com.emirhan.day3.springboot.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;


@Service // Bu sınıfın Spring Service olduğunu belirtir
public class OcrService {

    // Fiş dosyasını alır ve OCR sonucunu String olarak döndürür
    public String extractText(MultipartFile file) throws Exception {

        // Dosya gelmemişse veya dosya boşsa hata ver
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Dosya boş.");
        }

        // Tesseract'ın okuyabilmesi için geçici dosya oluştur
        Path tempFile = Files.createTempFile("receipt-", ".jpg");

        try {
            // Gelen MultipartFile'ı geçici dosyaya kaydet
            file.transferTo(tempFile.toFile());

            // Tesseract programını çalıştırmak için ProcessBuilder oluştur
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "C:\\Program Files\\Tesseract-OCR\\tesseract.exe",

                    // Tesseract'a okuyacağı fotoğrafın yolunu ver
                    tempFile.toAbsolutePath().toString(),

                    // OCR sonucunu direkt çıktı olarak al
                    "stdout",

                    // Türkçe + İngilizce OCR kullan
                    "-l",
                    "tur+eng"
            );

            // Hata çıktısını da normal çıktıyla birleştir
            processBuilder.redirectErrorStream(true);

            // Tesseract'ı çalıştır
            Process process = processBuilder.start();

            // OCR sonucunu burada biriktireceğiz
            StringBuilder output = new StringBuilder();

            // Tesseract'ın çıktısını oku
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            )) {

                String line;

                // Gelen metni satır satır oku
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            // Tesseract'ın işleminin bitmesini bekle
            int exitCode = process.waitFor();

            // 0 değilse OCR işlemi başarısız olmuş demektir
            if (exitCode != 0) {
                throw new RuntimeException(
                        "Tesseract OCR işlemi başarısız. Exit code: " + exitCode
                );
            }

            // OCR sonucunu String olarak geri döndür
            String ocrText = output.toString().trim();
            return ocrText;

        } finally {

            // İşlem bitince geçici dosyayı sil
            Files.deleteIfExists(tempFile);
        }
    }
}