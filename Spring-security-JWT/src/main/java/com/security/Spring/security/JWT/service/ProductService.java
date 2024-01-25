package com.security.Spring.security.JWT.service;

import com.security.Spring.security.JWT.entity.Product;
import jakarta.transaction.Transactional;

import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Integer id);
    Product saveProduct(Product product);
    @Transactional
    Product updateProduct(Integer id, Product product);
    void deleteProduct(Integer id);
}
