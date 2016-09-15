package com.pidrive.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by SiddarthaPeteti on 9/15/2016.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class IllegalTypeException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public IllegalTypeException(){}

    public IllegalTypeException(String message){
        super(message);
    }

    public IllegalTypeException(String message, Throwable cause){
        super(message,cause);
    }
}
