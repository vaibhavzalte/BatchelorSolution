package com.uv.bsol_backend.transformer;

import java.util.List;
//entity DTO
public interface DataTransformer<E,D> {
    Long getId();
    String getPrimaryId();

    String getSecondaryId();

    String getType();

    String getSubType();

//    RES getPayload();
    E getEntity();     // original entity
    D toDTO();         // mapped DTO
    Double getLatitude();

    Double getLongitude();

    void setImages(List<String> images);

    Class<?> getEntityClass();
    Class<D> getDtoClass();
}