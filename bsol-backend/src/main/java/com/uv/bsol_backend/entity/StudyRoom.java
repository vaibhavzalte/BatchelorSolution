package com.uv.bsol_backend.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyRoom extends CommonListingFields {

    private String roomName; // e.g. "Silent Study Room A"

    private String location; // e.g. "2nd Floor, Building B"

    private Integer capacity; // total seats

    private Integer availableSeats;

    private Boolean isAvailable; // room open or not

    private Boolean hasWifi;

    private Boolean hasChargingPoints;

    private Boolean hasAC;

    private String rules; // e.g. "No talking, No phone calls"

    private OffsetDateTime openingTime;

    private OffsetDateTime closingTime;

    private Double rating;

    private String description;

    @CreationTimestamp
    private OffsetDateTime createdAt;

    private String createdBy;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;

}
