package com.uv.bsol_backend.controller;

import com.uv.bsol_backend.service.ListingService;
import com.uv.bsol_backend.transformer.DataTransformer;
import com.uv.bsol_backend.transformer.DataTransformerFactory;
import com.uv.bsol_backend.transformer.ListingType;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("uv-api/v1")
@CrossOrigin("http://localhost:3000")
@Slf4j
public class ListingController {
    @Autowired
    DataTransformerFactory dataTransformerFactory;

    @Autowired
    private ListingService listingService;

    @PostMapping(
            value = "/{mgmtName}/{typeName}",
            produces = {"application/json;charset=utf-8"},
            consumes = {"application/json;charset=utf-8"}
    )
    public ResponseEntity<Object> createListing(
            @PathVariable String mgmtName,
            @PathVariable String typeName,
            @Valid @RequestBody JsonNode body
    ) {
        log.info("Received request to create listing for mgmtName: {}, typeName: {}, with body: {}", mgmtName, typeName, body);
        DataTransformer<?> transformer = dataTransformerFactory.getTransformerFor(ListingType.fromValue(typeName), body.toString());
        Object o = listingService.createListing(transformer);
        log.info("Created primary id : {}", transformer.getPrimaryId());
        return new ResponseEntity<>(o, HttpStatus.CREATED);
    }

    @GetMapping(
            value = "/{mgmtName}/{typeName}",
            produces = {"application/json;charset=utf-8"}
    )
    public ResponseEntity<List<Object>> getListings(
            @PathVariable String mgmtName,
            @PathVariable String typeName,
            @RequestParam Map<String, String> allParams
    ) {
        log.info("Received request to get all listing of type {} with these parameters {}", typeName, allParams);
        DataTransformer<?> transformer = dataTransformerFactory.getTransformerFor(ListingType.fromValue(typeName), null);
        List<Object> listings = (List<Object>) listingService.getListingsByTypeAndFilters(transformer.getTransactionClass(), transformer.getType(), allParams);
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }
    @GetMapping
    public String getListings() {
        return "Application is running";
    }
}
