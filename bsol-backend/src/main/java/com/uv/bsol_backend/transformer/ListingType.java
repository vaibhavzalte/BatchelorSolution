package com.uv.bsol_backend.transformer;

public enum ListingType {
    Room("room"),
    Mess("mess"),
    RoomVacancy("room-vacancy");

    private final String value;
    ListingType(String value) {this.value = value;}

    public static ListingType fromValue(String value){
        for(ListingType b : ListingType.values()) {
            if (b.value.equals(value)) {
                return b;
            }

        }
        throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }
}
