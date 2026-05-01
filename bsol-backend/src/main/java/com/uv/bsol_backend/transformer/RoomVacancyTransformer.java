package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.RoomVacancy;

public class RoomVacancyTransformer extends BaseTransformer<RoomVacancy, RoomVacancy> {
    public static final String LISTING_TYPE = "RoomVacancy";

    public RoomVacancyTransformer(RoomVacancy roomVacancy) {
        super(roomVacancy);
    }

    @Override
    public Long getPrimaryId() {
        return null;
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public RoomVacancy getPayload() {
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


    @Override
    public Class<?> getTransactionClass() {
        return RoomVacancy.class;
    }

    @Override
    public Class<?> getResponseClass() {
        return null;
    }
}
