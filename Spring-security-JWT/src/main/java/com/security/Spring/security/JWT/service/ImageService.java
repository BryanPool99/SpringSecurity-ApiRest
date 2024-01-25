package com.security.Spring.security.JWT.service;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
@Service
public class ImageService {
    @Value("${app.upload.dir}")
    private String uploadDir;

    public String saveImage(MultipartFile file) throws IOException {
        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }

        // Calcular el hash SHA-256 del contenido del archivo
        String fileHash = DigestUtils.sha256Hex(file.getBytes());

        // Generar un nombre único basado en el hash
        String uniqueFileName = fileHash + "_" + file.getOriginalFilename();

        Path filePath = Path.of(uploadDir, uniqueFileName);

        // Verificar si la imagen ya existe, si existe, devolver la URL
        if (Files.exists(filePath)) {
            return "/images/" + uniqueFileName;
        }

        // Guardar la imagen
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Devolver la URL del archivo guardado
        return "/images/" + uniqueFileName;
    }

    public String getImageUrl(String uniqueFileName) {
        return "/images/" + uniqueFileName;
    }
}