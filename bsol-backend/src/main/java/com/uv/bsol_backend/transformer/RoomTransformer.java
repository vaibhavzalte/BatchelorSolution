package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.RoomDTO;
import com.uv.bsol_backend.entity.Room;

public class RoomTransformer extends BaseTransformer<Room, RoomDTO> {
    public static final String LISTING_TYPE = "Room";

    public RoomTransformer(Room room) {
        super(room);
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
    public RoomDTO toDTO() {
        return RoomDTO.builder()
                .title(listing.getTitle())
                .description(listing.getDescription())
                .roomType(listing.getRoomType())
                .availableFor(listing.getAvailableFor())
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
                .images(listing.getImages())
                .ownerContact(listing.getOwnerContact())
                .ownerName(listing.getOwnerName())
                .ownerEmail(listing.getOwnerEmail())
                .build();
    }


    @Override
    public Class<RoomDTO> getEntityClass() {
        return RoomDTO.class;
    }

    @Override
    public Class<RoomDTO> getDtoClass() {
        return RoomDTO.class;
    }


}
