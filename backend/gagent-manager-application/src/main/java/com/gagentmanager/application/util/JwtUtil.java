package com.gagentmanager.application.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/** JWT 工具类，负责 Access Token 和 Refresh Token 的生成与解析，密钥从配置文件读取 */
@Component
public class JwtUtil {

    @Value("${jwt.access-token-secret:gagent-manager-jwt-secret-key-must-be-at-least-256-bits-long}")
    private String accessTokenSecret;

    @Value("${jwt.refresh-token-secret:gagent-manager-refresh-token-secret-key-must-be-at-least-256-bits}")
    private String refreshTokenSecret;

    @Value("${jwt.access-token-expiration:7200000}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpiration;

    private SecretKey getAccessKey() {
        return Keys.hmacShaKeyFor(accessTokenSecret.getBytes(StandardCharsets.UTF_8));
    }

    private SecretKey getRefreshKey() {
        return Keys.hmacShaKeyFor(refreshTokenSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(Long userId, String username) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(getAccessKey())
                .compact();
    }

    public String generateRefreshToken(Long userId) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(getRefreshKey())
                .compact();
    }

    public Claims parseAccessToken(String token) {
        return Jwts.parser()
                .verifyWith(getAccessKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Claims parseRefreshToken(String token) {
        return Jwts.parser()
                .verifyWith(getRefreshKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long getUserId(String token) {
        Claims claims = parseAccessToken(token);
        return Long.valueOf(claims.getSubject());
    }

    public String getUsername(String token) {
        Claims claims = parseAccessToken(token);
        return claims.get("username", String.class);
    }
}
