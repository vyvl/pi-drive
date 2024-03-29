package com.pidrive.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by siddarthapeteti on 9/19/2016.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class TagNotFoundException extends RuntimeException {
    public TagNotFoundException(String message){
        super(message);
    }
}
