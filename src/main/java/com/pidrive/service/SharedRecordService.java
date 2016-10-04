package com.pidrive.service;

import com.pidrive.model.Record;
import com.pidrive.model.SharedRecord;
import com.pidrive.model.User;
import com.pidrive.repository.SharedRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.integration.IntegrationAutoConfiguration;
import org.springframework.stereotype.Service;
import sun.nio.cs.ext.SJIS;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by siddarthapeteti on 9/28/2016.
 */
@Service
public class SharedRecordService {

    @Autowired
    private UserService userService;

    @Autowired
    private SharedRecordRepository sharedRecordRepository;

    public SharedRecord createNewSharedRecord(String userName, Record record, int permission){
        User user = userService.findUser(userName);
        SharedRecord sharedRecord = new SharedRecord();
        sharedRecord.setRecord(record);
        sharedRecord.setUser(user);
        sharedRecord.setPermission(permission);
        sharedRecord = sharedRecordRepository.saveAndFlush(sharedRecord);
        return sharedRecord;
    }

    public SharedRecord saveSharedRecord(SharedRecord sharedRecord){
        return sharedRecordRepository.saveAndFlush(sharedRecord);
    }

    public List<Record> getAllSharedRecords(String userName){
        User user = userService.findUser(userName);
        List<Integer> permissions = Arrays.asList(1,2);
        List<SharedRecord> sharedRecords = sharedRecordRepository.findByUserAndPermissionIn(user,permissions);
        List<Record> records = sharedRecords.stream().map(shared -> shared.getRecord()).collect(Collectors.toList());
        return records;
    }

    public List<Record> getAllTrashedRecords(User user){
        List<SharedRecord> sharedRecords = sharedRecordRepository.findByUserAndRecordIsTrashed(user,true);
        List<Record> records = sharedRecords.stream().map(shared -> shared.getRecord()).collect(Collectors.toList());
        return records;
    }

    public List<Record> filterRecordsForUser(User user,List<Record> records){
        List<SharedRecord> sharedRecords = sharedRecordRepository.findByUserAndRecordIn(user,records);
        records = sharedRecords.stream().map(shared -> shared.getRecord()).collect(Collectors.toList());;
        return records;
    }

    public List<Record> filterRecordsByName(User user, String search){
        List<SharedRecord> sharedRecords = sharedRecordRepository.findByUserAndRecordNameIgnoreCaseContaining(user,search);
        return mapSharedRecordsToRecords(sharedRecords);
    }

    public List<Record> mapSharedRecordsToRecords(List<SharedRecord> sharedRecords){
        return sharedRecords.stream().map(shared -> shared.getRecord()).collect(Collectors.toList());
    }
}
