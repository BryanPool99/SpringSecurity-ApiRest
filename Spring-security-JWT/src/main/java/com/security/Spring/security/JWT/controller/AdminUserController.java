package com.security.Spring.security.JWT.controller;
import com.security.Spring.security.JWT.dto.ReqRes;
import com.security.Spring.security.JWT.entity.Product;
import com.security.Spring.security.JWT.repository.ProductRepository;
import com.security.Spring.security.JWT.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")  // Ajusta según tus necesidades
public class AdminUserController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductService productService;

    @GetMapping("/public/product")
    public ResponseEntity<Object> getAllProducts(){
        return ResponseEntity.ok(productRepository.findAll());
    }
    //listar productos por id
    @GetMapping("/public/product/{id}")
    public ResponseEntity<Product> getCategoryById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        return product != null
                ? new ResponseEntity<>(product, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @GetMapping("/user/alone")
    public ResponseEntity<Object> userAlone(){
        return ResponseEntity.ok("Users alone can access this ApI only");
    }

    @GetMapping("/adminuser/both")
    public ResponseEntity<Object> bothAdminaAndUsersApi(){
        return ResponseEntity.ok("Both Admin and Users Can  access the api");
    }
}
