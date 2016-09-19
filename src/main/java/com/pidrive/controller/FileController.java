package com.pidrive.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pidrive.exception.IllegalTypeException;
import com.pidrive.model.FileContent;
import com.pidrive.model.Record;
import com.pidrive.repository.FileContentRepository;
import com.pidrive.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by SiddarthaPeteti on 9/11/2016.
 */
@RestController
@RequestMapping("/files")
public class FileController {

    @Autowired
    private RecordService recordService;

    @Autowired
    private FileContentRepository contentRepository;

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> createRecord(@RequestBody Record record){
        record = recordService.saveNewRecord(record);
        return  new ResponseEntity<>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.GET)
    public ResponseEntity<?> getRecord(@PathVariable Long id){
        Record record = recordService.getUntrashedRecord(id);
        return new ResponseEntity<>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/children", method = RequestMethod.GET)
    public ResponseEntity<?> getChildren(@PathVariable long id){
        Record record = recordService.getRecord(id);
        if(!record.isFolder()){
            throw new IllegalTypeException("Folder Expected, Got File");
        }
        List<Record> children = record.getChildren();
        List<Record> unTrashedChildren = new ArrayList<>();
        for (int i = 0; i < children.size(); i++) {
            Record child = children.get(i);
            if(!child.isTrashed()){
                unTrashedChildren.add(child);
            }
        }
        return new ResponseEntity<Object>(unTrashedChildren,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/content", method = RequestMethod.POST)
    public ResponseEntity<?> uploadFile(@PathVariable Long id, @RequestParam MultipartFile file){
        Record record = recordService.setContent(id,file);
        ResponseEntity<?> resp = new ResponseEntity<>(record,HttpStatus.OK);
        return resp;
    }

    @RequestMapping(value = "/{id}/content", method = RequestMethod.GET)
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id){
        Record record = recordService.getUntrashedRecord(id);
        if(record.isFolder()){
            throw new IllegalTypeException("File Expected, Got Folder");
        }
        FileContent content = record.getContent();
        ByteArrayResource byteArrayResource = new ByteArrayResource(content.getContent());
        HttpHeaders header = new HttpHeaders();
        header.set("Content-Disposition",
                "attachment; filename=" + record.getName());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .headers(header)
                .body(byteArrayResource);
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.DELETE)
    public ResponseEntity<?>  trashRecord(@PathVariable Long id){
       Record record = recordService.trashRecord(id);
        return new ResponseEntity<>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/untrash",method = RequestMethod.POST)
    public ResponseEntity<?>  unTrashRecord(@PathVariable Long id){
        Record record = recordService.getRecord(id);
        if(!record.isTrashed()){
            throw new IllegalStateException("Record is not trashed");
        }
        record.setTrashed(false);
        record = recordService.saveRecord(record);
        return new ResponseEntity<>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/trash",method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteRecord(@PathVariable Long id){
        String status = recordService.deleteRecord(id);
        Map<String,String> statusMap = new HashMap<>();
        statusMap.put("status",status);
        return new ResponseEntity<Object>(statusMap,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/trash",method = RequestMethod.GET)
    public ResponseEntity<Object> getTrashedRecord(@PathVariable Long id){
        Record record = recordService.getRecord(id);
        if(!record.isTrashed()){
            throw new IllegalStateException("Record is not trashed");
        }
        return new ResponseEntity<>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/copy", method = RequestMethod.POST, consumes = "application/json")
    public Record copyRecord(@PathVariable long id,@RequestBody long newID){

        Record newRecord = new Record();
        Record record = recordService.getRecord(id);
        newRecord.setName(record.getName());
        newRecord.setParent(recordService.getUntrashedFolder(newID));
        newRecord = recordService.saveNewRecord(newRecord);
        FileContent copyContent = new FileContent();
        FileContent content = record.getContent();
        copyContent.setContent(content.getContent());
        contentRepository.saveAndFlush(content);
        newRecord.setContent(copyContent);
        recordService.saveRecord(newRecord);
        return newRecord;
    }



    @RequestMapping(value = "/{id}/rename", method = RequestMethod.POST)
    public ResponseEntity<?> renameRecord(@PathVariable Long id, @RequestBody String jsonBody) {
        Record record = recordService.getUntrashedRecord(id);
        JsonNode node = null;
        try {
            node = new ObjectMapper().readValue(jsonBody,JsonNode.class);
        } catch (IOException e) {
            throw new IllegalTypeException("Response body in in not proper json format");
        }
        if(node.get("newName")==null){
            throw new IllegalTypeException("Response body in in not proper json format");
        }
        record.setName(node.get("newName").asText());
        record = recordService.saveRecord(record);
        return new ResponseEntity<>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/move", method = RequestMethod.POST)
    public ResponseEntity<?> moveRecord(@PathVariable Long id, @RequestBody String newParent){
        Record record = recordService.getUntrashedRecord(id);
        JsonNode node = null;
        try {
            node = new ObjectMapper().readValue(newParent,JsonNode.class);
        } catch (IOException e) {
            throw new IllegalTypeException("Response body in in not proper json format");
        }
        if(node.get("newParent")==null){
            throw new IllegalTypeException("Response body in in not proper json format");
        }
        Record parent = recordService.getRecord(node.get("newParent").asLong());
        if(!parent.isFolder()){
            throw new IllegalStateException("Cant move a record into a file. Expected Folder. Got File");
        }
        if(recordService.isAncestor(parent,record)){
            throw new IllegalStateException("Move a parent inside child is not permitted");
        }
        record.setParent(parent);
        record = recordService.saveRecord(record);
        return new ResponseEntity<>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/trash",method = RequestMethod.GET)
    public ResponseEntity<?> getTrashedRecords(){
        List<Record> trashedRecords = recordService.getTrashedRecords();
        return new ResponseEntity<>(trashedRecords,HttpStatus.OK);
    }




}
