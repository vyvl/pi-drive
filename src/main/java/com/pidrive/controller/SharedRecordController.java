package com.pidrive.controller;

import com.pidrive.exception.UserNotFoundException;
import com.pidrive.model.Record;
import com.pidrive.model.SharedRecord;
import com.pidrive.security.IAuthenticationFacade;
import com.pidrive.service.RecordService;
import com.pidrive.service.SharedRecordService;
import com.pidrive.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by siddarthapeteti on 9/29/2016.
 */
@RestController
@RequestMapping("/shared")
public class SharedRecordController {

    @Autowired
    private SharedRecordService sharedRecordService;

    @Autowired
    private IAuthenticationFacade authenticationFacade;

    @Autowired
    private UserService userService;

    @Autowired
    private RecordService recordService;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<?> shareRecord(@RequestBody SharedRecord sharedRecord){
        if(sharedRecord.getUser()==null){
            throw new UserNotFoundException("The username you specified does not exist");
        }
        sharedRecord = sharedRecordService.saveSharedRecord(sharedRecord);
        return new ResponseEntity<Object>(sharedRecord, HttpStatus.OK);
    }

    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public ResponseEntity<?> getSharedFiles(){
        String userName = authenticationFacade.getAuthentication().getName();
        List<Record> records = sharedRecordService.getAllSharedRecords(userName);
        return new ResponseEntity<Object>(records,HttpStatus.OK);
    }


}
