package net.javaguids.ems_backend.util;

import net.javaguids.ems_backend.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ApiResponseUtil {

    private ApiResponseUtil() {
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T data, HttpStatus status) {
        ApiResponse<T> body = new ApiResponse<>(true, message, data);
        return new ResponseEntity<>(body, status);
    }

    public static ResponseEntity<ApiResponse<Object>> error(String message, HttpStatus status) {
        ApiResponse<Object> body = new ApiResponse<>(false, message, null);
        return new ResponseEntity<>(body, status);
    }
}