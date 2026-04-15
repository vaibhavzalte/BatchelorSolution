package com.uv.bsol_backend.service;

import com.uv.bsol_backend.entity.ListingsEntity;
import com.uv.bsol_backend.repository.ListingsRepository;
import com.uv.bsol_backend.transformer.DataTransformer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ListingService {

    @Autowired
    private ListingsRepository listingsRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EntityManager entityManager;

    public <T> T createListing(DataTransformer<T> transformer) {
       ListingsEntity entity = listingsRepository.findByIdAndTypeAndStatus(transformer.getPrimaryId(), transformer.getType(), "ACTIVE");
         if(entity != null) {
              throw new RuntimeException("Listing already exists with primary id: " + transformer.getPrimaryId() + " and type: " + transformer.getType());
         }
        ListingsEntity newEntity = ListingsEntity.builder()
                .secondaryId(transformer.getSecondaryId())
                .payload(getJsonString(transformer.getPayload()))
                .type(transformer.getType())
                .updatedBy(transformer.getUpdatedBy())
                .latitude(transformer.getLatitude())
                .longitude(transformer.getLongitude())
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
            System.out.println("entity"+entity.getPayload());
            dto = objectMapper.readValue(entity.getPayload(), dtoClassName);
        }
        return dto;
    }

    public <T> List<T> getListingsByTypeAndFilters(Class<T> clazz, String type, Map<String, String> allParams) {
        log.info("get listing sql creating...");
        StringBuilder query = new StringBuilder("SELECT DISTINCT t1 FROM ListingsEntity t1 WHERE type=:type");
        Map<String, Object> filterParams = addFilterConditions(query, allParams);
        filterParams.put("type", type);
        TypedQuery<ListingsEntity> listingsQuery = entityManager.createQuery(query.toString(), ListingsEntity.class);
        setFilterParameters(listingsQuery, filterParams);
        List<ListingsEntity> listings = listingsQuery.getResultList();
        System.out.println("listings"+listings);
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
            addFixedQueryCondition("createdBy", allParams, query, filterValues);
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

    private static void addFixedQueryCondition(String paramName, Map<String, String> allParams, StringBuilder query, Map<String, Object> filterValues) {
        String paramValue = allParams.get(paramName);
        if (paramValue != null && !paramValue.isEmpty()) {
            query.append(" AND  t1.").append(paramName).append(" = :").append(paramName);
            filterValues.put(paramName, paramValue);
            allParams.remove(paramName);
        }
    }

}
