package com.uv.bsol_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("uv-api/v1")
public class ListingController {
    @GetMapping
    public String getListings() {
        return "Application is running";
    }
}
