package com.pidrive.controller;


import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pidrive.model.FileContent;
import com.pidrive.model.Record;
import com.pidrive.repository.FileContentRepository;
import com.pidrive.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private FileContentRepository fileContentRepository;

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
            record = recordService.saveRecord(record);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new ResponseEntity<Object>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.GET)
    public ResponseEntity<?> getRecord(@PathVariable Long id){
        Record record = recordService.getRecord(id);
        return new ResponseEntity<Object>(record,HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/content", method = RequestMethod.POST)
    public ResponseEntity<?> uploadFile(@PathVariable Long id, @RequestParam MultipartFile file){
        Record record = recordService.getRecord(id);
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
        //fileContentRepository.saveAndFlush(content);
        record.setContent(content);
        record = recordService.saveRecord(record);
        ResponseEntity<?> resp = new ResponseEntity<Object>(record,HttpStatus.OK);
        return resp;
    }


}
