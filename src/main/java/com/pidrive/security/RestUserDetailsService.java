package com.pidrive.security;

import com.pidrive.model.User;
import com.pidrive.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.UserDetailsServiceConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * Created by SiddarthaPeteti on 9/10/2016.
 */
@Component
public class RestUserDetailsService implements UserDetailsService {
    @Autowired
    private UserService userService;
    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        User user = userService.findUser(userName);
        if(user==null){
            throw new UsernameNotFoundException(String.format("User with the username %s doesn't exist", userName));
        }
        UserDetails userDetails = new org.springframework.security.core.userdetails.User
                (user.getUsername(),user.getPassword(), new ArrayList<>());
        return userDetails;
    }
}
