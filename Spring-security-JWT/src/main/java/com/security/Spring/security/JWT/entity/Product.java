package com.security.Spring.security.JWT.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @Lob
    @Column(name = "image_url")
    //private byte[] image;
    private String imageUrl;

}
