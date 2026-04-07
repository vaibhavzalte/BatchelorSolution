package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.ListingsEntity;

public interface ListingTransformer<T> {
    String getPrimaryId();
    String getSecondaryId();
    String getType();
    String getSubType();
    T getPayload();
    String getCreatedBy();
    String getUpdatedBy();
    Class<?> getTransactionClass();
}