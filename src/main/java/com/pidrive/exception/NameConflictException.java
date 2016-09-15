package com.pidrive.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.print.attribute.standard.MediaSize;

/**
 * Created by SiddarthaPeteti on 9/15/2016.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class NameConflictException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public NameConflictException(){

    }
    public NameConflictException(String message){
        super(message);
    }
    public NameConflictException(String message, Throwable cause){
        super(message,cause);
    }
}
