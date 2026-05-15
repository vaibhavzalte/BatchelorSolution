package com.uv.bsol_backend.service;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class GCPFileStorageService implements FileStorageService {

    private final String bucketName;
    private final Storage storage;

    public GCPFileStorageService(String bucketName, String projectId) {
        this.bucketName = bucketName;
        this.storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
    }

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        BlobId blobId = BlobId.of(bucketName, filename);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
        storage.create(blobInfo, file.getBytes());
        // Return the public URL or the gcs path. Usually, a public URL is preferred.
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, filename);
    }

    @Override
    public List<String> storeFiles(List<MultipartFile> files) throws IOException {
        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                fileUrls.add(storeFile(file));
            }
        }
        return fileUrls;
    }

    @Override
    public byte[] loadFile(String fileUrl) throws IOException {
        String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        return storage.readAllBytes(bucketName, filename);
    }
}
