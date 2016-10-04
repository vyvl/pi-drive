package com.pidrive.controller;

import com.pidrive.security.IAuthenticationFetcher;
import com.pidrive.service.UserService;
import com.pidrive.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Created by SiddarthaPeteti on 9/9/2016.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private IAuthenticationFetcher authenticationFacade;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> registerUser(@RequestParam(value = "username" , required = true) String userName,
                        @RequestParam(value="password", required = true) String password){
        if(userService.findUser(userName)!=null){
            return new ResponseEntity<>("Username already exists.",HttpStatus.BAD_REQUEST);
        }
        User newUser = new User(userName,password);
        userService.saveUser(newUser);
        return new ResponseEntity<>("User registered successfully.",HttpStatus.OK);
    }

    @RequestMapping(value = "/{username}",method = RequestMethod.GET)
    public ResponseEntity<?> getUser(@PathVariable String username){
        User user = userService.findUser(username);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    @RequestMapping(value = "/getLoggedInUser",method = RequestMethod.GET)
    public ResponseEntity<?> getLoggedInUser(){
        Authentication auth = authenticationFacade.getAuthentication();
        String username = auth.getName();
        return getUser(username);
    }

}
