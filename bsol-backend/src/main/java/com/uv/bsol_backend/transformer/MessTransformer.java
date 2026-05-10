package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.MessPayload;
import com.uv.bsol_backend.entity.Mess;

public class MessTransformer extends BaseTransformer<Mess, MessPayload> {
    public static final String LISTING_TYPE = "Mess";
    MessTransformer(Mess mess) {
        super(mess);
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }


    @Override
    public MessPayload toDTO() {
        return MessPayload.builder()
                .messName(listing.getMessName())
                .description(listing.getDescription())
                .foodType(listing.getFoodType())
                .mealType(listing.getMealType())
                .monthlyFee(listing.getMonthlyFee())
                .perMealFee(listing.getPerMealFee())
                .homeDelivery(listing.getHomeDelivery())
                .diningArea(listing.getDiningArea())
                .address(listing.getAddress())
                .area(listing.getArea())
                .ownerName(listing.getOwnerName())
                .ownerContact(listing.getOwnerContact())
                .ownerEmail(listing.getOwnerEmail())
                .images(listing.getImages())
                .build();
    }

    @Override
    public Class<Mess> getEntityClass() {
        return Mess.class;
    }

    @Override
    public Class<MessPayload> getDtoClass() {
        return MessPayload.class;
    }


}
