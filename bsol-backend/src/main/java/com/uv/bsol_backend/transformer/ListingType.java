package com.uv.bsol_backend.transformer;

public enum ListingType {
    ROOM("Room"),
    MESS("Mess"),
    ROOM_VACANCY("RoomVacancy"),
    FOOD_STALL("FoodStall"),
    STUDY_ROOM("StudyRoom");

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
