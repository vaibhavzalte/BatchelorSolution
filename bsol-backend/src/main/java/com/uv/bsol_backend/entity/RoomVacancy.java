package com.uv.bsol_backend.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomVacancy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomType;        // Single / Double / Triple
    private int totalBeds;
    private int availableBeds;

    private Double rent;
    private Double deposit;
    private Double brokerage;
    private String description;

    private boolean attachedBathroom;
    private boolean furnished;

    private List<String> amenities; // WiFi, AC, Washing Machine

    private String availableFrom;   // ISO date (String or LocalDate)

    private String preferredTenant; // Male / Female / Any

    private String foodIncluded;    // Yes / No / Optional
}
