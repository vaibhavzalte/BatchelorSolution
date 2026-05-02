package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.Mess;

public class MessTransformer extends BaseTransformer<Mess, Mess> {

    MessTransformer(Mess listing) {
        super(listing);
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
    public Mess toDTO() {
        return null;
    }

    @Override
    public Class<Mess> getEntityClass() {
        return null;
    }

    @Override
    public Class<Mess> getDtoClass() {
        return null;
    }


}
