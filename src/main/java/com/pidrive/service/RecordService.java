package com.pidrive.service;

import com.pidrive.model.Record;
import com.pidrive.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by SiddarthaPeteti on 9/11/2016.
 */
@Service
@Repository
public class RecordService {
    @Autowired
    private RecordRepository recordRepository;

    @Transactional
    public Record saveRecord(Record record){
        if(record!=null){
            recordRepository.saveAndFlush(record);
            return record;
        }
        return record;
    }

    @Transactional
    public Record getRecord(Long id){
        return recordRepository.findOne(id);
    }

    @Transactional
    public void deleteRecord(Long id){
        recordRepository.delete(id);
    }

    @Transactional
    public List<Record> getChildRecords(Record parent){
        List<Record> children = parent.getChildren();
        return  children;
    }
}
