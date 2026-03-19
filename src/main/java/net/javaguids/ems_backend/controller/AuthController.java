package net.javaguids.ems_backend.controller;

import lombok.extern.slf4j.Slf4j;
import net.javaguids.ems_backend.dto.AuthResponse;
import net.javaguids.ems_backend.dto.LoginRequest;
import net.javaguids.ems_backend.dto.RegisterRequest;
import net.javaguids.ems_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        log.info("Register request received for username: {}", request.getUserName());
        AuthResponse response = userService.register(request);
        log.info("User registered successfully: {}", request.getUserName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        log.info("Login request received for username: {}", request.getUserName());
        AuthResponse response = userService.login(request);
        log.info("User logged in successfully: {}", request.getUserName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            String username = auth.getName();
            log.info("Logout request received for username: {}", username);
            SecurityContextHolder.clearContext();
            log.info("User logged out successfully: {}", username);
            return ResponseEntity.ok("Logout successful. Please remove the token from client.");
        }
        log.warn("Logout attempt with no authenticated user");
        return ResponseEntity.ok("Already logged out");
    }
}
