package com.pidrive.controller;


import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pidrive.exception.IllegalTypeException;
import com.pidrive.exception.RecordNotFound;
import com.pidrive.model.FileContent;
import com.pidrive.model.Record;
import com.pidrive.repository.FileContentRepository;
import com.pidrive.service.RecordService;
import com.sun.xml.internal.ws.client.sei.ResponseBuilder;
import org.apache.catalina.connector.Response;
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


    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> createRecord(@RequestBody String recordJSON){

        ObjectMapper objectMapper = new ObjectMapper();
        Record record = new Record();
        try {
            JsonNode root = objectMapper.readValue(recordJSON,JsonNode.class);
            record.setName(root.get("name").asText());
            record.setFolder(root.get("folder").asBoolean());
            Record parent = recordService.getRecord(root.get("parent").asLong());
            record.setParent(parent);
            record = recordService.saveNewRecord(record);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return  new ResponseEntity<>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.GET)
    public ResponseEntity<?> getRecord(@PathVariable Long id){
        Record record = recordService.getRecord(id);
        if(record==null){
            throw new RecordNotFound("No record with this id exists");
        }
        return new ResponseEntity<Object>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/content", method = RequestMethod.POST)
    public ResponseEntity<?> uploadFile(@PathVariable Long id, @RequestParam MultipartFile file){
        Record record = recordService.setContent(id,file);
        ResponseEntity<?> resp = new ResponseEntity<Object>(record,HttpStatus.OK);
        return resp;
    }

    @RequestMapping(value = "/{id}/content", method = RequestMethod.GET)
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id){
        Record record = recordService.getRecord(id);
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

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateRecord(@PathVariable Long id,@RequestBody String recordJSON){
        ObjectMapper objectMapper = new ObjectMapper();
        Record record = recordService.getRecord(id);
        try {
            JsonNode node = objectMapper.readValue(recordJSON,JsonNode.class);
            record.setName(node.get("name").asText());
            Record parent = recordService.getRecord(node.get("parent").asLong());
            record.setParent(parent);
            record = recordService.saveRecord(record);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<Object>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.DELETE)
    public String  trashRecord(@PathVariable Long id){
        String status = recordService.trashRecord(id);
        return status;
    }

    @RequestMapping(value = "/{id}/trash",method = RequestMethod.DELETE)
    public String  deleteRecord(@PathVariable Long id){
        String status = recordService.deleteRecord(id);
        return status;
    }

    @RequestMapping(value = "/{id}/copy", method = RequestMethod.POST, consumes = "application/json")
    public Record copyRecord(@PathVariable long id,@RequestBody long newID){
        return null;
    }

    @RequestMapping(value = "/{id}/children", method = RequestMethod.GET)
    public ResponseEntity<?> getChildren(@PathVariable long id){
        Record record = recordService.getRecord(id);
        if(!record.isFolder()){
            throw new IllegalTypeException("File Expected, Got Folder");
        }
        List<Record> children = record.getChildren();
        return new ResponseEntity<Object>(children,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/rename", method = RequestMethod.GET)
    public ResponseEntity<?> renameRecord(@PathVariable Long id, @RequestBody String newName){
        Record record = recordService.getRecord(id);
        record.setName(newName);
        record = recordService.saveRecord(record);
        return new ResponseEntity<Object>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/move", method = RequestMethod.GET)
    public ResponseEntity<?> moveRecord(@PathVariable Long id, @RequestBody long newParent){
        Record record = recordService.getRecord(id);
        record.setParent(recordService.getRecord(newParent));
        record = recordService.saveRecord(record);
        return new ResponseEntity<Object>(record,HttpStatus.OK);
    }


}
