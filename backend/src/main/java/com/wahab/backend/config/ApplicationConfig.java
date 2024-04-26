package com.wahab.backend.config;

import com.wahab.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration class that sets up application-specific beans and configurations for security.
 * This includes configuring beans responsible for user authentication and password encoding.
 */
@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository repository;

    /**
     * Defines a bean for the UserDetailsService that is used by Spring Security
     * to load user details. This service is crucial for authenticating users based on their username.
     *
     * @return an instance of UserDetailsService that uses a custom method to load user details
     *         from the database by username.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            /**
             * Loads a user's details from the database using the provided username.
             * The username is expected to be the user's email.
             *
             * @param username the username (email) of the user to load
             * @return UserDetails containing the user's information
             * @throws UsernameNotFoundException if the user cannot be found in the database
             */
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return repository
                        .findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
            }
        };
    }

    /**
     * Provides a custom AuthenticationProvider that uses DaoAuthenticationProvider with a specified
     * UserDetailsService and PasswordEncoder. This provider is responsible for authenticating users
     * by verifying user credentials against stored credentials.
     *
     * @return the configured DaoAuthenticationProvider
     */
    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Creates a bean that provides the authentication manager from Spring Security configuration.
     * The authentication manager is central to Spring Security's authentication process.
     *
     * @param config the authentication configuration provided by Spring Security
     * @return the authentication manager
     * @throws Exception if an error occurs in getting the authentication manager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Defines a bean for the PasswordEncoder that uses BCrypt hashing algorithm for encoding passwords.
     * BCrypt is a strong cryptographic password hasher recommended by Spring Security.
     *
     * @return the BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}