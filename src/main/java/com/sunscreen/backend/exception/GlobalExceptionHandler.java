//GlobalExceptionHandler

package com.sunscreen.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public Map<String, Object> handleGeneric(Exception ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("message", ex.getMessage());
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());

        return error;
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public Map<String, Object> handleValidation(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {

        Map<String, Object> error = new HashMap<>();
        Map<String, String> fieldErrors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(err -> {
            fieldErrors.put(err.getField(), err.getDefaultMessage());
        });

        error.put("status", 400);
        error.put("errors", fieldErrors);

        return error;
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public Map<String, Object> handleDuplicate(Exception ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("status", 400);
        error.put("message", "Username already exists");

        return error;
    }
}