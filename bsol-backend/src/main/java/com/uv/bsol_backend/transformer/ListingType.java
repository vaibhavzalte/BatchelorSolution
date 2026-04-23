package com.uv.bsol_backend.transformer;

public enum ListingType {
    ROOM("room"),
    MESS("Mess"),
    ROOM_VACANCY("room-vacancy"),
    FOOD_STALL("food-stall"),
    STUDY_ROOM("study-room");

    private final String value;

    ListingType(String value) {
        this.value = value;
    }

    public static ListingType fromValue(String value) {
        for (ListingType b : ListingType.values()) {
            if (b.value.equals(value)) {
                return b;
            }

        }
        throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }
}
