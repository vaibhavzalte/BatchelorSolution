package com.uv.bsol_backend.transformer;

import java.util.List;

public interface DataTransformer<REQ,RES> {
    Long getPrimaryId();

    String getSecondaryId();

    String getType();

    String getSubType();

    RES getPayload();

    Double getLatitude();

    Double getLongitude();

    void setImages(List<String> images);

    Class<?> getTransactionClass();
    Class<?> getResponseClass();
}