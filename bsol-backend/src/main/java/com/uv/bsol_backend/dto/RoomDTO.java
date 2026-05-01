package com.uv.bsol_backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RoomDTO {
    // 🔹 Basic Info
    private String title;   // e.g. "1BHK Room for Boys in Kothrud"

    private String description;

    // 🔹 Room Details
    private String roomType;   // 1RK, 1BHK, 2BHK

    private String availableFor; // BOYS / GIRLS / FAMILY

    private Boolean furnished; // true / false

    private Integer totalRooms;

    private Integer availableRooms;

    // 🔹 Pricing
    private Double rent;

    private Double deposit;

    private Double maintenance;

    private Double brokerage;

    // 🔹 Amenities
    private List<String> amenities; // wifi,parking,ac,foodIncluded,attachedBathroom

    // 🔹 Location
    private String address;

    private String city;

    private String area;


    // 🔹 Owner Info
    private String ownerName;

    private String ownerContact;

    private String ownerEmail;

    protected List<String> images;
}
