package com.uv.bsol_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class CommonListingFields {
    protected Long id; // no need to send from frontend
    protected String type; // no need to send from frontend
    protected String subType;
    protected String primaryId; 
    protected String city;
    protected Double latitude;
    protected Double longitude;
    protected List<String> images;
    protected String status;
}