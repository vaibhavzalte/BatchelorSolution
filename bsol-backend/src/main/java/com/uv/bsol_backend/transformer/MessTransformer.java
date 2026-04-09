package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.Mess;

public class MessTransformer extends BaseTransformer<Mess>{

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
    public String getCreatedBy() {
        return null;
    }

    @Override
    public String getUpdatedBy() {
        return null;
    }

    @Override
    public Class<?> getTransactionClass() {
        return null;
    }
}
