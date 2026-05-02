package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.CommonListingFields;

import java.util.List;

public abstract class BaseTransformer<E extends CommonListingFields, D> implements DataTransformer<E, D> {
    // common logic here
    protected E listing;

    BaseTransformer(E listing) {
        this.listing = listing;
    }

    @Override
    public Long getId(){
        return null;
    }

    @Override
    public String getPrimaryId() {
        return null;
    }

    @Override
    public void setImages(List<String> images) {
        listing.setImages(images);
    }

    @Override
    public E getEntity() {
        return listing;
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
    public Double getLatitude() {
        return listing.getLatitude();
    }

    @Override
    public Double getLongitude() {
        return listing.getLongitude();
    }
}
