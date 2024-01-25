package com.security.Spring.security.JWT.service.Imp;

import com.security.Spring.security.JWT.entity.Product;
import com.security.Spring.security.JWT.repository.ProductRepository;
import com.security.Spring.security.JWT.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ProductServiceImp implements ProductService {
    private ProductRepository productRepository;
    @Autowired
    public ProductServiceImp(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Integer id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Integer id, Product product) {
        Product existingProduct = productRepository.findById(id).orElse(null);

        if (existingProduct != null) {
            // Actualiza solo si se proporciona un nuevo nombre
            if (product.getName() != null) {
                existingProduct.setName(product.getName());
            }

            // Actualiza solo si se proporciona una nueva URL de imagen
            if (product.getImageUrl() != null) {
                existingProduct.setImageUrl(product.getImageUrl());
            }

            // Guarda y devuelve el producto actualizado
            return productRepository.save(existingProduct);
        }

        // Maneja el caso cuando el producto no existe
        return null;
    }

    @Override
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}
