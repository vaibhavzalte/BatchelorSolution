package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.RoomVacancy;

public class RoomVacancyTransformer extends BaseTransformer<RoomVacancy, RoomVacancy> {
    public static final String LISTING_TYPE = "RoomVacancy";

    public RoomVacancyTransformer(RoomVacancy roomVacancy) {
        super(roomVacancy);
    }


    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public RoomVacancy toDTO() {
        return null;
    }


    @Override
    public Class<?> getEntityClass() {
        return RoomVacancy.class;
    }

    @Override
    public Class<RoomVacancy> getDtoClass() {
        return null;
    }

}
