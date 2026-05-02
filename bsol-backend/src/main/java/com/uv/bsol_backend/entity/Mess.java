package com.uv.bsol_backend.entity;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Mess extends CommonListingFields {


    private Long id;

    // 🔹 Basic Info
    private String title;   // e.g. "Shree Ganesh Mess"

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

    // 🔹 Status
    private String status; // AVAILABLE / CLOSED / INACTIVE

    private List<String> images;

}
