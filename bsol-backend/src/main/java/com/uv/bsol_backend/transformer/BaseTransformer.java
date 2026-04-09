package com.uv.bsol_backend.transformer;

public abstract class BaseTransformer<T> implements DataTransformer<T> {
    // common logic here
    T listing;
    BaseTransformer(T listing){
        this.listing=listing;
    }

    @Override
    public String getSecondaryId() {
        return "";
    }

    @Override
    public String getSubType() {
        return null;
    }

    @Override
    public T getPayload() {
        return listing;
    }

}
