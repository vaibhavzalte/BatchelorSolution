package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.Mess;

public class MessTransformer extends BaseTransformer<Mess,Mess> {

    MessTransformer(Mess listing) {
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
        return null;
    }

    @Override
    public String getSubType() {
        return null;
    }

    @Override
    public Mess getPayload() {
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
        return null;
    }

    @Override
    public Class<?> getResponseClass() {
        return null;
    }
}
