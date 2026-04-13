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
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    // 🔹 Amenities
    private Boolean wifi;
    private Boolean parking;
    private Boolean ac;
    private Boolean foodIncluded;
    private Boolean attachedBathroom;

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
    private String status; // AVAILABLE / FULL / INACTIVE

    // 🔹 Audit Fields
    @CreationTimestamp
    private OffsetDateTime createdAt;

    private String createdBy;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;

    private String updatedBy;
}
