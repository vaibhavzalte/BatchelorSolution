package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.RoomDTO;
import com.uv.bsol_backend.entity.Room;

public class RoomTransformer extends BaseTransformer<Room, RoomDTO> {
    public static final String LISTING_TYPE = "Room";

    public RoomTransformer(Room room) {
        super(room);
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
    public String getSubType() {
        return listing.getRoomType();
    }

    @Override
    public RoomDTO getPayload() {
        return RoomDTO.builder()
                .title(listing.getTitle())
                .description(listing.getDescription())
                .roomType(listing.getRoomType())
                .availableFor(listing.getAvailableFor())
                .furnished(listing.getFurnished())
                .totalRooms(listing.getTotalRooms())
                .availableRooms(listing.getAvailableRooms())
                .rent(listing.getRent())
                .deposit(listing.getDeposit())
                .maintenance(listing.getMaintenance())
                .brokerage(listing.getBrokerage())
                .amenities(listing.getAmenities())
                .address(listing.getAddress())
                .city(listing.getCity())
                .area(listing.getArea())
                .build();
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
    public Class<RoomDTO> getTransactionClass() {
        return RoomDTO.class;
    }

    @Override
    public Class<?> getResponseClass() {
        return Room.class;
    }
}
