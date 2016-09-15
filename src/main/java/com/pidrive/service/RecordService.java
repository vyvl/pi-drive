package com.pidrive.service;

import com.pidrive.model.FileContent;
import com.pidrive.model.Record;
import com.pidrive.repository.FileContentRepository;
import com.pidrive.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
@Repository
public class RecordService {
    @Autowired
    private RecordRepository recordRepository;
    @Autowired
    private  FileContentRepository fileContentRepository;

    @Transactional
    public Record saveRecord(Record record){
        if(record==null) return null;
        List<Record> recordsWithSameName = recordRepository.findByNameAndParentAndIsFolder(record.getName(),record.getParent(),record.isFolder());
        if(recordsWithSameName.size()==0){
            recordRepository.saveAndFlush(record);
            return record;
        }
        return null;
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

        }
        record.setTrashed(true);
        return "Successfully trashed your file with ID:"+id;
    }

    @Transactional
    public List<Record> getChildRecords(Record parent){
        List<Record> children = parent.getChildren();
        return  children;
    }

    @Transactional
    public Record setContent(long id,MultipartFile file){
        Record record = this.getRecord(id);
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
