package com.sunscreen.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Map;

@Service
public class FileStorageService {

    @Value("${STORAGE_TYPE:local}")
    private String storageType;

    @Autowired(required = false)
    private Cloudinary cloudinary;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    public String uploadFile(MultipartFile file, String baseUrl) throws Exception {

        // ✅ LOCAL MODE (YOUR CURRENT LOGIC MOVED HERE)
        if ("local".equalsIgnoreCase(storageType)) {

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            File dest = new File(UPLOAD_DIR + fileName);
            file.transferTo(dest);

            return baseUrl + "/images/" + fileName;
        }

        // ✅ CLOUD MODE (NEW)
        else if ("cloud".equalsIgnoreCase(storageType)) {

            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap()
            );

            return uploadResult.get("secure_url").toString();
        }

        throw new RuntimeException("Invalid storage type");
    }
}