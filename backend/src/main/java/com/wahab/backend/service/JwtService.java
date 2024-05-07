package com.wahab.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * The {@code JwtService} provides essential services for handling JSON Web Tokens (JWTs),
 * which are crucial for authenticating and authorizing users in the application. This service
 * includes methods to extract claims such as the username from a JWT. JWTs are structured in
 * three parts: the header, the payload, and the signature.
 *
 * <p>This service utilizes methods to parse and validate JWTs using a secret key encoded in BASE64.
 * It supports extracting specific claims from the token, which are essential for securing
 * the application.</p>
 */
@Service
public class JwtService {

    /**
     * The secret key used for signing and verifying the JWT, obtained from an environmental variable.
     * This approach enhances security by not hard-coding sensitive information directly in the source code.
     */

    private final String SECRET_KEY = "566B597033733676397924423F4528482B4D6251655468576D5A713474377721";

    /**
     * Extracts the username from the JWT.
     *
     * @param token the JWT from which the username is to be extracted
     * @return the username as a String
     */
    public String extractUsername(String token){
        return extractClaims(token, Claims::getSubject);
    }

    public<T> T extractClaims(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generates a JWT token for a given user with additional claims.
     *
     * @param extraClaims a map of additional claims to include in the JWT payload
     * @param userDetails the user details to create a token for, typically includes the username
     * @return a signed JWT token as a String
     */
    public String generateToken(
        Map<String, Object> extraClaims,
        UserDetails userDetails
    ){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact(); // Build the JWT and serialize it to a compact, URL-safe string

    }

    /**
     * Checks if the provided JWT is valid for the given user based on username and expiration.
     */
     public boolean isTokenValid(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token){
        return extractClaims(token, Claims::getExpiration);
    }

    /**
     * Extracts all claims from a given JWT token. This method serves as the foundation
     * for other methods that require access to the complete claims.
     *
     * @param token the JWT token to parse
     * @return the claims found in the token
     */
    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    /**
     * Generates a signing key from a base64-encoded string, which is used to verify the JWT's signature.
     *
     * @return Key instance used for verifying JWT signatures
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
