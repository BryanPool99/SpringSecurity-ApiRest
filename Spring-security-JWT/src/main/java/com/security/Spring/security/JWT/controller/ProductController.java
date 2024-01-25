package com.security.Spring.security.JWT.controller;

import com.security.Spring.security.JWT.entity.Product;
import com.security.Spring.security.JWT.service.ImageService;
import com.security.Spring.security.JWT.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/admin/product")
@CrossOrigin(origins = "*")  // Ajusta según tus necesidades
public class ProductController {
    @Autowired
    private ImageService imageService;
    @Autowired
    private ProductService productService;
    //listar productos por id
    @GetMapping("/{id}")
    public ResponseEntity<Product> getCategoryById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        return product != null
                ? new ResponseEntity<>(product, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    //Agregar producto

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> addProduct(@RequestParam("name") String name,
                                              @RequestParam("file") MultipartFile file) {
        try {
            // Guardar la imagen y obtener la URL
            String imageUrl = imageService.saveImage(file);

            // Crear y guardar el producto con la URL de la imagen
            Product newProduct = new Product();
            newProduct.setName(name);
            newProduct.setImageUrl(imageUrl);
            return ResponseEntity.ok(productService.saveProduct(newProduct));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    //ACTUALIZAR PRODUCTO

    @PutMapping(value = "/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id,
                                                 @RequestPart(value = "file", required = false) MultipartFile file,
                                                 @RequestPart("name") String name) {
        try {
            Product existingProduct = productService.getProductById(id);

            if (existingProduct == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Actualiza el nombre del producto
            existingProduct.setName(name);

            // Actualiza la imagen solo si se proporciona un nuevo archivo
            if (file != null && !file.isEmpty()) {
                String imageUrl = imageService.saveImage(file);
                existingProduct.setImageUrl(imageUrl);
            }

            Product updatedProduct = productService.updateProduct(id,existingProduct);

            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);

        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //ELIMINAR PRODUCTO
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>("Producto eliminada exitosamente", HttpStatus.OK);
    }
}
