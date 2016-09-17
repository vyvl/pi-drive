package com.pidrive.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by SiddarthaPeteti on 9/15/2016.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class IllegalTypeException extends RuntimeException {

    public IllegalTypeException(String message){
        super(message);
    }

}
