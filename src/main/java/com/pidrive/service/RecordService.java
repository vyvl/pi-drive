package com.pidrive.service;

import com.pidrive.exception.IllegalTypeException;
import com.pidrive.exception.NameConflictException;
import com.pidrive.model.FileContent;
import com.pidrive.model.Record;
import com.pidrive.repository.FileContentRepository;
import com.pidrive.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.print.attribute.standard.MediaSize;
import java.io.IOException;
import java.util.List;

/**
 * Created by SiddarthaPeteti on 9/11/2016.
 */
@Service
@Repository
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
        return recordRepository.findOne(id);
    }

    @Transactional
    public String deleteRecord(Long id){
        String status= "";
        Record record = recordRepository.findOne(id);
        if(record.isTrashed()) {
            recordRepository.delete(id);
            status = "File deleted successfully.";
        }
        else{
            record.setTrashed(true);
            recordRepository.saveAndFlush(record);
            status = "File moved to trash.";
        }
        return status;
    }

    @Transactional
    public String trashRecord(Long id){
        Record record = this.getRecord(id);
        if(record.isTrashed()){
            throw new IllegalStateException("Record is trashed already");
        }
        record.setTrashed(true);
        return "Successfully trashed your file with ID:"+id;
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
        Record record = this.getRecord(id);
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
}
