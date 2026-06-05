//JwtFilter

package com.sunscreen.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.List;

public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.startsWith("/login")
                || path.startsWith("/register")
                || path.startsWith("/products")
                || path.startsWith("/images")
                || path.startsWith("/config")



// Front end static permit
                || path.startsWith("/css")
                || path.endsWith(".js")
                || path.endsWith(".css")
                || path.endsWith(".html")
                || path.equals("/favicon.ico")



        ) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            String token = authHeader.substring(7);
            int userId = JwtUtil.extractUserId(token);

            String role = JwtUtil.extractRole(token);


            //  IMPORTANT: set Spring Security context
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            List.of(new SimpleGrantedAuthority(role))
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // also set request attribute (your usage)
            request.setAttribute("userId", userId);
            request.setAttribute("role", role);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}