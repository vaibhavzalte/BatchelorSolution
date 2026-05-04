package com.uv.bsol_backend.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MessDTO {

    protected List<String> images;

    // 🔹 Basic Info
    private String messName;

    private String description;

    // 🔹 Mess Details
    private String foodType; // VEG / NON-VEG / BOTH

    private String mealType; // BREAKFAST / LUNCH / DINNER / ALL

    // 🔹 Pricing
    private Double monthlyFee;

    private Double perMealFee;

    // 🔹 Amenities
    private Boolean homeDelivery;
    private Boolean diningArea;

    // 🔹 Location
    private String address;

    private String city;

    private String area;

    // 🔹 Owner Info
    private String ownerName;

    private String ownerContact;

    private String ownerEmail;
}
