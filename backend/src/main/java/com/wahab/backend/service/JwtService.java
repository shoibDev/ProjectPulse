package com.wahab.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.function.Function;


//This is going to be used for extracting the ccliams ie we want to extract the username from the jwttoken
// the jwt consistes of 3 areas, the header, the payload and the signnature
@Service
public class JwtService {

    private static final String SECRET_KEY = "uslnzbDMvcK9yr6Dms5VR6Iqv2OGgyKa";

    public String extractUsername(String token){
        return extractClaims(token, Claims::getSubject);
    }

    public<T> T extractClaims(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
