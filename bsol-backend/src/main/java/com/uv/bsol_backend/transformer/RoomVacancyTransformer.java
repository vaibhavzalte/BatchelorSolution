package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.RoomVacancy;

public class RoomVacancyTransformer extends BaseTransformer<RoomVacancy> {
    public static final String LISTING_TYPE = "RoomVacancy";
    public RoomVacancyTransformer(RoomVacancy roomVacancy){
        super(roomVacancy);
    }

    @Override
    public Long getPrimaryId() {
        return listing.getId();
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public String getSubType() {
        return listing.getRoomType();
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
    public Class<RoomVacancy> getTransactionClass() {
        return RoomVacancy.class;
    }
}
