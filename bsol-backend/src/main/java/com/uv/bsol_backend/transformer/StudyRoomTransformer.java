package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.StudyRoom;

public class StudyRoomTransformer extends BaseTransformer<StudyRoom,StudyRoom> {
    public static final String LISTING_TYPE = "StudyRoom";

    public StudyRoomTransformer(StudyRoom studyRoom) {
        super(studyRoom);
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
        return null;
    }

    @Override
    public StudyRoom getPayload() {
        return null;
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
    public Class<StudyRoom> getTransactionClass() {
        return StudyRoom.class;
    }

    @Override
    public Class<?> getResponseClass() {
        return null;
    }
}
