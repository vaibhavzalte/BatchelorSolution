package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.RoomVacancyDTO;
import com.uv.bsol_backend.entity.RoomVacancy;

public class RoomVacancyTransformer extends BaseTransformer<RoomVacancy, RoomVacancyDTO> {
    public static final String LISTING_TYPE = "RoomVacancy";

    public RoomVacancyTransformer(RoomVacancy roomVacancy) {
        super(roomVacancy);
    }


    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public RoomVacancyDTO toDTO() {
        return RoomVacancyDTO.builder()
                .title(listing.getTitle())
                .description(listing.getDescription())
                .roomType(listing.getRoomType())
                .totalVacancies(listing.getTotalVacancies())
                .preferredTenant(listing.getPreferredTenant())
                .rent(listing.getRent())
                .deposit(listing.getDeposit())
                .maintenance(listing.getMaintenance())
                .brokerage(listing.getBrokerage())
                .amenities(listing.getAmenities())
                .availableFrom(listing.getAvailableFrom())
                .address(listing.getAddress())
                .city(listing.getCity())
                .area(listing.getArea())
                .ownerContact(listing.getOwnerContact())
                .ownerName(listing.getOwnerName())
                .ownerEmail(listing.getOwnerEmail())
                .images(listing.getImages())
                .build();
    }


    @Override
    public Class<RoomVacancy> getEntityClass() {
        return RoomVacancy.class;
    }

    @Override
    public Class<RoomVacancyDTO> getDtoClass() {
        return RoomVacancyDTO.class;
    }

}
