package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.Mess;
import com.uv.bsol_backend.entity.Room;
import com.uv.bsol_backend.entity.RoomVacancy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class DataTransformerFactory {
    @Autowired
    ObjectMapper objectMapper;

    public DataTransformer<?> getTransformerFor(ListingType type, String payload) {
        DataTransformer<?> transformer = null;
        switch (type) {
            case Room ->
                    transformer = new RoomTransformer(payload == null ? null : objectMapper.readValue(payload, Room.class));
            case Mess ->
                    transformer = new MessTransformer(payload == null ? null : objectMapper.readValue(payload, Mess.class));
            case RoomVacancy ->
                    transformer = new RoomVacancyTransformer(payload == null ? null : objectMapper.readValue(payload, RoomVacancy.class));
            default -> throw new IllegalArgumentException("Invalid Listing Type " + type);
        }
        return transformer;
    }
}
