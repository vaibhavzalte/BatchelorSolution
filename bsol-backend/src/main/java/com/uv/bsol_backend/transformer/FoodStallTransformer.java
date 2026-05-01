package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.FoodStall;

public class FoodStallTransformer extends BaseTransformer<FoodStall,FoodStall> {
    public static final String LISTING_TYPE = "FoodStall";

    FoodStallTransformer(FoodStall listing) {
        super(listing);
    }

    @Override
    public Long getPrimaryId() {
        return null;
    }

    @Override
    public String getSecondaryId() {
        return null;
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public String getSubType() {
        return null;
    }

    @Override
    public FoodStall getPayload() {
        return listing;
    }

    @Override
    public Double getLatitude() {
        return null;
    }

    @Override
    public Double getLongitude() {
        return null;
    }

    @Override
    public Class<?> getTransactionClass() {
        return FoodStall.class;
    }

    @Override
    public Class<?> getResponseClass() {
        return null;
    }
}
