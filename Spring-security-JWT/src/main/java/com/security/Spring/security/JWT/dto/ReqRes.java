package com.security.Spring.security.JWT.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.security.Spring.security.JWT.entity.OurUsers;
import com.security.Spring.security.JWT.entity.Product;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReqRes {
    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String name;
    private String lastname;
    private String email;
    private String role;
    private String password;
    private List<Product> products;
    private OurUsers ourUsers;
    private MultipartFile file;
}