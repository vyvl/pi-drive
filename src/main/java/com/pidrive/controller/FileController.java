package com.pidrive.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.pidrive.exception.IllegalTypeException;
import com.pidrive.exception.RecordNotFoundException;
import com.pidrive.exception.TagNotFoundException;
import com.pidrive.model.*;
import com.pidrive.repository.FileContentRepository;
import com.pidrive.repository.TagRepository;
import com.pidrive.security.IAuthenticationFacade;
import com.pidrive.service.RecordService;
import com.pidrive.service.SharedRecordService;
import com.pidrive.service.TagService;
import com.pidrive.service.UserService;
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
import java.net.URLEncoder;
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
    private UserService userService;

    @Autowired
    private FileContentRepository contentRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private TagService tagService;

    @Autowired
    private SharedRecordService sharedRecordService;

    @Autowired
    private IAuthenticationFacade authenticationFacade;

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> createRecord(@RequestBody Record record){
        record = recordService.saveNewRecord(record);
        String userName =authenticationFacade.getAuthentication().getName();
        SharedRecord sharedRecord = sharedRecordService.createNewSharedRecord(userName,record,0);
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

    @RequestMapping(value = "/add_file", method = RequestMethod.POST)
    public ResponseEntity<?> addFile(@RequestParam MultipartFile file,@RequestParam Long parentId){
        String name = file.getOriginalFilename();
        boolean folder = false;
        Record parent = null;
        try {
            parent = recordService.getRecord(parentId);
        }
        catch (RuntimeException e){
            parent = null;
        }

        Record record = new Record();
        record.setName(name);
        if(parent!=null) {
            record.setParent(parent);
        }
        record.setFolder(false);
        record = recordService.saveRecord(record);
        record = recordService.setContent(record.getId(),file);
        String userName =authenticationFacade.getAuthentication().getName();
        SharedRecord sharedRecord = sharedRecordService.createNewSharedRecord(userName,record,0);
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
        ByteArrayResource byteArrayResource = null;
        try {
            byteArrayResource = new ByteArrayResource(content.getContent());
        }
        catch (Exception e){
            throw new RecordNotFoundException("File Content not found");
        }
        HttpHeaders header = new HttpHeaders();
        header.set("Content-Disposition",
                "attachment; filename=\"" + record.getName()+"\"");
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
    public Record copyRecord(@PathVariable long id, @RequestBody String newParent){
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
        Record newRecord = new Record();
        Record record = recordService.getRecord(id);
        newRecord.setName(record.getName());
        newRecord.setParent(parent);
        newRecord = recordService.saveNewRecord(newRecord);
        FileContent copyContent = new FileContent();
        FileContent content = record.getContent();
        byte[] contentData = content!=null ?content.getContent():new byte[0];
        copyContent.setContent(contentData);
        copyContent.setRecord(newRecord);
        contentRepository.saveAndFlush(content);
        newRecord.setContent(copyContent);
        recordService.saveRecord(newRecord);
        String userName =authenticationFacade.getAuthentication().getName();
        SharedRecord sharedRecord = sharedRecordService.createNewSharedRecord(userName,newRecord,0);
        return newRecord;
    }



    @RequestMapping(value = "/{id}/rename", method = RequestMethod.POST)
    public ResponseEntity<?> renameRecord(@PathVariable Long id, @RequestBody String jsonBody) {
        Record record = recordService.getRecord(id);
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

    @RequestMapping(value = "/list/trash",method = RequestMethod.GET)
    public ResponseEntity<?> getTrashedRecords(){
        User current = getCurrentUser();

        List<Record> trashedRecords = sharedRecordService.getAllTrashedRecords(current);
        return new ResponseEntity<>(trashedRecords,HttpStatus.OK);
    }


    @RequestMapping(value = "/{id}/tags", method = RequestMethod.POST)
    public ResponseEntity<?> tagRecord(@PathVariable Long id, @RequestBody String tagsJson){
        DocumentContext jsonContext = JsonPath.parse(tagsJson);
        String jsonTagsPath = "$.tags";
        List<String> tags = jsonContext.read(jsonTagsPath);
        Record record = recordService.addTags(id,tags);
        return new ResponseEntity<Object>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/tags", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteTag(@PathVariable Long id, @RequestBody String tagsJson){
        Record record = recordService.getUntrashedRecord(id);
        DocumentContext jsonContext = JsonPath.parse(tagsJson);
        String jsonTagsPath = "$.tag";
        String tag = jsonContext.read(jsonTagsPath);
        Tag tagEntity = tagRepository.findByRecordAndTag(record,tag);
        if(tagEntity==null){
            throw new TagNotFoundException("Tag not found");
        }
        tagRepository.delete(tagEntity);
        record = recordService.getUntrashedRecord(id);
        return new ResponseEntity<Object>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/list/{tag}",method = RequestMethod.GET)
    public ResponseEntity<?> getRecordsByTag(@PathVariable String tag){
        User user = getCurrentUser();
        List<Record> records = tagService.findRecordsByTag(user,tag);
        return new ResponseEntity<Object>(records,HttpStatus.OK);
    }

    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public ResponseEntity<?> getAllRecords(){
        List<Record> records = recordService.getAllRecords();
        return new ResponseEntity<Object>(records,HttpStatus.OK);
    }

    @RequestMapping(value = "/root",method = RequestMethod.GET)
    public ResponseEntity<?> getRootRecords(){
        Record root = getCurrentUser().getRoot();
        //List<Record> records = root.getChildren();
        return new ResponseEntity<Object>(root,HttpStatus.OK);
    }

    @RequestMapping(value = "/empty_trash", method = RequestMethod.POST)
    public ResponseEntity<?> emptyTrash(){
        Long deletedCount = recordService.emptyTrash();
        Map<String,Long> response = new HashMap<>();
        response.put("DeletedCount",deletedCount);
        return new ResponseEntity<Object>(response, HttpStatus.OK);
    }

    private String getUsername(){
        return authenticationFacade.getAuthentication().getName();
    }

    private com.pidrive.model.User getCurrentUser(){
        String userName = getUsername();
        return userService.findUser(userName);
    }



}
