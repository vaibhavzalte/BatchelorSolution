package com.uv.bsol_backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileStorageService {
    String storeFile(MultipartFile file) throws IOException;

    List<String> storeFiles(List<MultipartFile> files) throws IOException;
    byte[] loadFile(String fileUrl) throws IOException;
}
