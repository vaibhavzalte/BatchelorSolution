package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.*;
import com.uv.bsol_backend.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class DataTransformerFactory {
    @Autowired
    ObjectMapper objectMapper;

    public DataTransformer<?, ?> getTransformerFor(ListingType type, String payload) {
        DataTransformer<?, ?> transformer = null;
        switch (type) {
            case ROOM ->
                    transformer = new RoomTransformer(payload == null ? null : objectMapper.readValue(payload, Room.class));
            case MESS ->
                    transformer = new MessTransformer(payload == null ? null : objectMapper.readValue(payload, Mess.class));
            case ROOM_VACANCY ->
                    transformer = new RoomVacancyTransformer(payload == null ? null : objectMapper.readValue(payload, RoomVacancy.class));
            case FOOD_STALL ->
                    transformer = new FoodStallTransformer(payload == null ? null : objectMapper.readValue(payload, FoodStall.class));
            case STUDY_ROOM ->
                    transformer = new StudyRoomTransformer(payload == null ? null : objectMapper.readValue(payload, StudyRoom.class));
            default -> throw new BadRequestException("Invalid Listing Type " + type);
        }
        return transformer;
    }
}
