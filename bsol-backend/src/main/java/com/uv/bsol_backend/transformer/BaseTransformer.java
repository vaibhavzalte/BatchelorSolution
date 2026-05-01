package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.CommonListingFields;
import java.util.List;

public abstract class BaseTransformer<REQ,RES> implements DataTransformer<REQ,RES> {
    // common logic here
    protected REQ listing;

    BaseTransformer(REQ listing) {
        this.listing = listing;
    }

    @Override
    public void setImages(List<String> images) {
        if (listing instanceof CommonListingFields) {
            ((CommonListingFields) listing).setImages(images);
        }
    }

    @Override
    public String getSecondaryId() {
        return "";
    }

    @Override
    public String getSubType() {
        return null;
    }

}
