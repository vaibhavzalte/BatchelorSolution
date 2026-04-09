package com.uv.bsol_backend.service;

import com.uv.bsol_backend.entity.ListingsEntity;
import com.uv.bsol_backend.repository.ListingsRepository;
import com.uv.bsol_backend.transformer.DataTransformer;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class ListingService {

    @Autowired
    private ListingsRepository listingsRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public <T> T createListing(DataTransformer<T> transformer) {
       ListingsEntity entity = listingsRepository.findByIdAndTypeAndStatus(transformer.getPrimaryId(), transformer.getType(), "ACTIVE");
         if(entity != null) {
              throw new RuntimeException("Listing already exists with primary id: " + transformer.getPrimaryId() + " and type: " + transformer.getType());
         }
        ListingsEntity newEntity = ListingsEntity.builder()
                .secondaryId(transformer.getSecondaryId())
                .payload(getJsonString(transformer.getPayload()))
                .type(transformer.getType())
                .status("Active")
                .build();
        listingsRepository.save(newEntity);
        return mapToDto(newEntity, (Class<T>) transformer.getPayload().getClass());

    }
    private String getJsonString(Object object) {
        return objectMapper.writeValueAsString(object);
    }
    private <T> T mapToDto(ListingsEntity entity, Class<T> dtoClassName) {
        T dto = null;
        if (entity != null && entity.getPayload() != null) {
            dto = objectMapper.readValue(entity.getPayload(), dtoClassName);
        }
        return dto;
    }

}
