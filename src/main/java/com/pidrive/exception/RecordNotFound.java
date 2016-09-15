package com.pidrive.exception;

/**
 * Created by SiddarthaPeteti on 9/15/2016.
 */
public class RecordNotFound extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public RecordNotFound(){}

    public RecordNotFound(String message){
        super(message);
    }

    public RecordNotFound(String message,Throwable cause){
        super(message,cause);
    }
}
