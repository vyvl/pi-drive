package com.pidrive.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.print.attribute.standard.MediaSize;

/**
 * Created by SiddarthaPeteti on 9/15/2016.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class NameConflictException extends RuntimeException {

    public NameConflictException(String message){
        super(message);
    }

}
