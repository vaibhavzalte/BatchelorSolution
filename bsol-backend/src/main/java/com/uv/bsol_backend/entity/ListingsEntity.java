package com.uv.bsol_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.OffsetDateTime;

@Entity
@Table(name = "listings")
@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ListingsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type")
    private String type;

    @Column(name = "sub_type")
    private String subType;

    @Column(name = "primary_id")
    private String primaryId;

    @Column(name = "secondary_id")
    private String secondaryId;

    @Column(name = "payload", columnDefinition = "TEXT")
    private String payload;

    private Double latitude;

    private Double longitude;

    @Column(name = "create_time")
    @CreationTimestamp
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private OffsetDateTime createTime;

    @Column(name = "update_time")
    @UpdateTimestamp
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private OffsetDateTime updateTime;

    @Column(name = "status")
    private String status;
}