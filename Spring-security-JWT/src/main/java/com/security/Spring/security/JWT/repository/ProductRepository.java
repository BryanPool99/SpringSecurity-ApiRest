package com.security.Spring.security.JWT.repository;

import com.security.Spring.security.JWT.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Integer> {
}
