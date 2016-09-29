package com.pidrive.model.DeSerializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.pidrive.model.Record;
import com.pidrive.model.SharedRecord;
import com.pidrive.model.User;
import com.pidrive.service.RecordService;
import com.pidrive.service.SharedRecordService;
import com.pidrive.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.remoting.jaxws.SimpleJaxWsServiceExporter;

import java.io.IOException;

/**
 * Created by siddarthapeteti on 9/29/2016.
 */
public class SharedRecordDeserializer extends JsonDeserializer {
    @Autowired
    private RecordService recordService;

    @Autowired
    private UserService userService;

    @Autowired
    private SharedRecordService sharedRecordService;

    @Override
    public SharedRecord deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        SharedRecord sharedRecord = new SharedRecord();
        JsonNode recordNode =  p.getCodec().readTree(p);
        sharedRecord.setPermission(recordNode.get("permission").asInt());
        Long recordId = recordNode.get("record_id").asLong();
        Record record = recordService.getRecord(recordId);
        sharedRecord.setRecord(record);
        User user = userService.findUser(recordNode.get("user_name").asText());
        sharedRecord.setUser(user);
        return sharedRecord;
    }
}
