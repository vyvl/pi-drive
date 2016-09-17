package com.pidrive.service;

import com.pidrive.exception.IllegalTypeException;
import com.pidrive.exception.NameConflictException;
import com.pidrive.exception.RecordNotFoundException;
import com.pidrive.model.FileContent;
import com.pidrive.model.Record;
import com.pidrive.repository.FileContentRepository;
import com.pidrive.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Created by SiddarthaPeteti on 9/11/2016.
 */
@Service
@ComponentScan("com.pidrive")
public class RecordService {
    @Autowired
    private RecordRepository recordRepository;
    @Autowired
    private  FileContentRepository fileContentRepository;

    @Transactional
    public Record saveRecord(Record record){
        if(record==null) return null;
        record = recordRepository.saveAndFlush(record);
        return record;
    }

    @Transactional
    public Record saveNewRecord(Record record){
        List<Record> recordsWithSameName = recordRepository.findByNameAndParentAndIsFolder(record.getName(),record.getParent(),record.isFolder());
        if(recordsWithSameName.size()!=0){
            throw new NameConflictException("Record with same name exists");
        }
        return saveRecord(record);
    }

    @Transactional
    public Record getRecord(Long id){
        Record record =  recordRepository.findOne(id);
        if(record==null){
            throw new RecordNotFoundException("No record with this id exists");
        }
        return record;
    }

    @Transactional
    public Record getUntrashedRecord(Long id){
        Record record = this.getRecord(id);
        if(record.isTrashed()){
            throw new RecordNotFoundException("No record with this id exists");
        }
        return record;
    }

    @Transactional
    public String deleteRecord(Long id){
        String status= "";
        Record record = this.getRecord(id);
        if(record.isTrashed()) {
            recordRepository.delete(id);
            status = "File deleted successfully.";
        }
        else{
            throw new IllegalStateException("File not trashed. You can only delete trashed files.");
        }
        return status;
    }

    @Transactional
    public Record trashRecord(Long id){
        Record record = this.getRecord(id);
        if(record.isTrashed()){
            throw new IllegalStateException("Record is trashed already");
        }
        record.setTrashed(true);
        record = this.saveRecord(record);
        return record;
    }

    @Transactional
    public List<Record> getChildRecords(Record parent){
        if(!parent.isFolder()){
            throw new IllegalTypeException("Folder Expected. Got File.");
        }
        List<Record> children = parent.getChildren();
        return  children;
    }

    @Transactional
    public Record setContent(long id,MultipartFile file){
        Record record = this.getUntrashedRecord(id);
        if(record.isFolder()){
            throw new IllegalTypeException("File Expected, Got Folder");
        }
        String name = file.getOriginalFilename();
        record.setName(name);
        FileContent content = record.getContent();
        if(content==null){
            content = new FileContent();
        }
        content.setRecord(record);
        try {
            content.setContent(file.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
        fileContentRepository.saveAndFlush(content);
        record.setContent(content);
        record = this.saveRecord(record);
        return record;
    }

    public boolean isAncestor(Record child, Record ancestor){
        while (child.getParent()!=null){
            if(child.getParent().getId()==ancestor.getId()){
                return true;
            }
            child = child.getParent();
        }
        return false;
    }
}
