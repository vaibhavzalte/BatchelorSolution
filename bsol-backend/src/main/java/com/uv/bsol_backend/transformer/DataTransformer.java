package com.uv.bsol_backend.transformer;


import com.uv.bsol_backend.entity.CommonListingFields;

import java.util.List;

//entity DTO
public interface DataTransformer<E extends CommonListingFields, D> {
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

    Class<E> getEntityClass();

    Class<D> getDtoClass();
}