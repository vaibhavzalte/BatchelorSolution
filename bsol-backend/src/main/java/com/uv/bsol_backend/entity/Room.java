package com.uv.bsol_backend.entity;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Room extends CommonListingFields {


    // 🔹 Basic Info
    private String title;

    private String description;

    // 🔹 Room Details
    private String roomType;   // 1RK, 1BHK, 2BHK

    private String availableFor; // BOYS / GIRLS / FAMILY

    private Integer totalRooms;

    private Integer availableRooms;

    // 🔹 Pricing
    private Double rent;

    private Double deposit;

    private Double maintenance;

    private Double brokerage;

    // 🔹 Amenities
    private List<String> amenities;

    // 🔹 Location
    private String address;

    private String city;

    private String area;


    // 🔹 Owner Info
    private String ownerName;

    private String ownerContact;

    private String ownerEmail;

    // coming soon
//    private List<String> rules;
//    private Double rating;

}
