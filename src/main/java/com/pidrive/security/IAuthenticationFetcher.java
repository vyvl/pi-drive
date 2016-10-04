package com.pidrive.security;

import org.springframework.security.core.Authentication;

/**
 * Created by siddarthapeteti on 9/28/2016.
 */
public interface IAuthenticationFetcher {
    Authentication getAuthentication();
}