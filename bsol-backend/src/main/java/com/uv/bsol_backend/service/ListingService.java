package com.uv.bsol_backend.service;

import com.uv.bsol_backend.entity.CommonListingFields;
import com.uv.bsol_backend.entity.ListingsEntity;
import com.uv.bsol_backend.repository.ListingsRepository;
import com.uv.bsol_backend.transformer.DataTransformer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class ListingService {

    @Autowired
    private ListingsRepository listingsRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private FileStorageService fileStorageService;

    private static void addFixedQueryCondition(String paramName, Map<String, String> allParams, StringBuilder query, Map<String, Object> filterValues) {
        String paramValue = allParams.get(paramName);
        if (paramValue != null && !paramValue.isEmpty()) {
            query.append(" AND  t1.").append(paramName).append(" = :").append(paramName);
            filterValues.put(paramName, paramValue);
            allParams.remove(paramName);
        }
    }

    public <E extends CommonListingFields, D> E createListingWithImages(DataTransformer<E, D> transformer, List<MultipartFile> images) {
        if (images != null && !images.isEmpty()) {
            try {
                List<String> imageUrls = fileStorageService.storeFiles(images);
                transformer.setImages(imageUrls);
//                    ((CommonListingFields) payload).setImages(imageUrls);
            } catch (java.io.IOException e) {
                log.error("Failed to store images", e);
                throw new RuntimeException("Failed to store images", e);
            }
        }
        return createListing(transformer);
    }

    public <E extends CommonListingFields, D> E createListing(DataTransformer<E, D> transformer) {
        ListingsEntity entity = listingsRepository.findByIdAndTypeAndStatus(transformer.getId(), transformer.getType(), "ACTIVE");
        if (entity != null) {
            throw new RuntimeException("Listing already exists with id: " + transformer.getId() + " and type: " + transformer.getType());
        }
        ListingsEntity newEntity = ListingsEntity.builder()
                .type(transformer.getType())
                .subType(transformer.getSubType())
                .primaryId(transformer.getPrimaryId())
                .secondaryId(transformer.getSecondaryId())
                .latitude(transformer.getLatitude())
                .longitude(transformer.getLongitude())
                .payload(getJsonString(transformer.toDTO()))
                .status("Active")
                .build();
        ListingsEntity listingDB = listingsRepository.save(newEntity);
        System.out.println(listingDB.toString());
        return mapToDto(listingDB, transformer.getEntityClass());
    }

    private String getJsonString(Object object) {
        return objectMapper.writeValueAsString(object);
    }

    private <T extends CommonListingFields> T mapToDto(ListingsEntity entity, Class<T> dtoClass) {
        T dto = null;

        if (entity != null && entity.getPayload() != null) {
            dto = objectMapper.readValue(entity.getPayload(), dtoClass);
            dto.setId(entity.getId());
            dto.setPrimaryId(entity.getPrimaryId());
            dto.setSecondaryId(entity.getSecondaryId());
            dto.setType(entity.getType());
            dto.setSubType(entity.getSubType());
            dto.setStatus(entity.getStatus());
            dto.setLatitude(entity.getLatitude());
            dto.setLongitude(entity.getLongitude());
        }

        return dto;
    }

    public <T extends CommonListingFields> T getListingById(Long id, Class<T> clazz) {
        Optional<ListingsEntity> entityOpt = listingsRepository.findById(id);
        ListingsEntity entity = entityOpt.orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));
        return mapToDto(entity, clazz);
    }

    public <E extends CommonListingFields, D> E updateListingById(Long id, DataTransformer<E, D> transformer, List<MultipartFile> images) {
        ListingsEntity entity = listingsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));
        if (images != null && !images.isEmpty()) {
            try {
                List<String> imageUrls = fileStorageService.storeFiles(images);
                transformer.setImages(imageUrls);
            } catch (java.io.IOException e) {
                log.error("Failed to store images during update", e);
                throw new RuntimeException("Failed to store images", e);
            }
        }
        ListingsEntity updated = entity.toBuilder()
                .subType(transformer.getSubType())
                .primaryId(transformer.getPrimaryId())
                .secondaryId(transformer.getSecondaryId())
                .latitude(transformer.getLatitude())
                .longitude(transformer.getLongitude())
                .payload(getJsonString(transformer.toDTO()))
                .build();
        ListingsEntity saved = listingsRepository.save(updated);
        log.info("Updated listing with id: {}", id);
        return mapToDto(saved, transformer.getEntityClass());
    }

    public <E extends CommonListingFields,D> void deleteListingById(DataTransformer<E,D> transformer, Long id) {
        ListingsEntity entity = listingsRepository.findByIdAndTypeAndStatus(id,transformer.getType(),"Active");
        if(entity ==null)
        {
            log.info("Listing not found with id: {}",id);
            throw new RuntimeException("Listing not found with id: " + id);
        }
        entity.setStatus("InActive");
        listingsRepository.save(entity);
    }

    public <T extends CommonListingFields> List<T> getListingsByTypeAndFilters(Class<T> clazz, String type, Map<String, String> allParams) {
        log.info("get listing sql creating...");
        StringBuilder query = new StringBuilder("SELECT DISTINCT t1 FROM ListingsEntity t1 WHERE type=:type");
        Map<String, Object> filterParams = addFilterConditions(query, allParams);
        filterParams.put("type", type);
        TypedQuery<ListingsEntity> listingsQuery = entityManager.createQuery(query.toString(), ListingsEntity.class);
        setFilterParameters(listingsQuery, filterParams);
        List<ListingsEntity> listings = listingsQuery.getResultList();
        List<T> dtoList = new ArrayList<>();
        for (ListingsEntity listingsEntity : listings) {
            T dto = mapToDto(listingsEntity, clazz);
            dtoList.add(dto);
        }
        return dtoList;
    }

    private void setFilterParameters(TypedQuery<ListingsEntity> transactionsQuery, Map<String, Object> filterParams) {
        filterParams.keySet().forEach(key -> transactionsQuery.setParameter(key, filterParams.get(key)));
    }

    private Map<String, Object> addFilterConditions(StringBuilder query, Map<String, String> allParams) {
        Map<String, Object> filterValues = new HashMap<>();
        if (allParams != null && !allParams.isEmpty()) {
            addFixedQueryCondition("subType", allParams, query, filterValues);
            addFixedQueryCondition("secondaryId", allParams, query, filterValues);
            addFixedQueryCondition("status", allParams, query, filterValues);
            addFixedQueryCondition("primaryId", allParams, query, filterValues);
            addFlexQueryConditions(allParams, query, filterValues);
        }
        return filterValues;
    }

    private void addFlexQueryConditions(Map<String, String> allParams, StringBuilder query, Map<String, Object> filterValues) {
        allParams.keySet().forEach(key -> addFlexQueryCondition(key, allParams.get(key), query, filterValues));
    }

    private void addFlexQueryCondition(String key, String value, StringBuilder query, Map<String, Object> filterValues) {
        query.append(" AND exists (select 1 from TransactionAttributesEntity t2 where t2.transaction.id = t1.id and t2.attributeName = '")
                .append(key).append("' and t2.attributeValue = :").append(key).append(") ");
        filterValues.put(key, value);
    }

}
