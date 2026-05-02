package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.StudyRoom;

public class StudyRoomTransformer extends BaseTransformer<StudyRoom, StudyRoom> {
    public static final String LISTING_TYPE = "StudyRoom";

    public StudyRoomTransformer(StudyRoom studyRoom) {
        super(studyRoom);
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
    public StudyRoom toDTO() {
        return null;
    }

    @Override
    public Class<StudyRoom> getEntityClass() {
        return null;
    }

    @Override
    public Class<StudyRoom> getDtoClass() {
        return null;
    }


}
