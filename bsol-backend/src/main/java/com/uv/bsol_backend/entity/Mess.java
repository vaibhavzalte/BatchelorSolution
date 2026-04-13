package com.uv.bsol_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mess {

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

    private Double latitude;

    private Double longitude;

    // 🔹 Owner Info
    private String ownerName;

    private String ownerContact;

    private String ownerEmail;

    // 🔹 Status
    private String status; // AVAILABLE / CLOSED / INACTIVE

    // 🔹 Audit Fields
    @CreationTimestamp
    private OffsetDateTime createdAt;

    private String createdBy;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;

    private String updatedBy;
}
