package net.javaguids.ems_backend.controller;

import lombok.extern.slf4j.Slf4j;
import net.javaguids.ems_backend.dto.ApiResponse;
import net.javaguids.ems_backend.dto.RegisterRequest;
import net.javaguids.ems_backend.dto.UserDto;
import net.javaguids.ems_backend.entity.User;
import net.javaguids.ems_backend.repository.UserRepository;
import net.javaguids.ems_backend.service.UserService;
import net.javaguids.ems_backend.util.ApiResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        log.info("Get all users request received");
        List<UserDto> users = userService.getAllUsers();
        log.info("Returning {} users", users.size());
        return ApiResponseUtil.success("Users fetched successfully", users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getUserById(@PathVariable Long id) {
        log.info("Get user by ID request received for ID: {}", id);
        User currentUser = getCurrentUser();
        if (!isAdmin() && !currentUser.getId().equals(id)) {
            log.warn("Access denied: User {} attempted to access user {}", currentUser.getId(), id);
            return ApiResponseUtil.error("You don't have permission to access this resource", HttpStatus.FORBIDDEN);
        }

        UserDto user = userService.getUserById(id);
        return ApiResponseUtil.<Object>success("User fetched successfully", user, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@RequestBody RegisterRequest request) {
        log.info("Create user request received for username: {}", request.getUserName());
        UserDto user = userService.createUser(request);
        log.info("User created successfully: {}", request.getUserName());
        return ApiResponseUtil.success("User created successfully", user, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        log.info("Update user request received for ID: {}", id);
        User currentUser = getCurrentUser();
        if (!isAdmin() && !currentUser.getId().equals(id)) {
            log.warn("Access denied: User {} attempted to update user {}", currentUser.getId(), id);
            return ApiResponseUtil.error("You don't have permission to access this resource", HttpStatus.FORBIDDEN);
        }

        UserDto updatedUser = userService.updateUser(id, userDto);
        log.info("User updated successfully with ID: {}", id);
        return ApiResponseUtil.<Object>success("User updated successfully", updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@PathVariable Long id) {
        log.info("Delete user request received for ID: {}", id);
        userService.deleteUser(id);
        log.info("User deleted successfully with ID: {}", id);
        return ApiResponseUtil.success("User deleted successfully", null, HttpStatus.OK);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        return userRepository.findByUserName(currentUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
