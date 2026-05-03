package com.uv.bsol_backend.dto;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RoomVacancyDTO {
    protected List<String> images;
    // 🔹 Basic Info
    private String title;
    private String description;

    private String roomType;
    private int totalVacancies;
    private String preferredTenant; // Male / Female / Any

    private Double rent;
    private Double deposit;
    private Double maintenance;
    private Double brokerage;

    private List<String> amenities; // WiFi, AC, Washing Machine

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private OffsetDateTime availableFrom;    // Yes / No / Optional
    // 🔹 Location
    private String address;

    private String city;

    private String area;


    // 🔹 Owner Info
    private String ownerName;

    private String ownerContact;

    private String ownerEmail;
}
