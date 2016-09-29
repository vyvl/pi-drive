package com.pidrive.model.Serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.pidrive.model.Record;
import com.pidrive.model.Tag;

import java.io.IOException;
import java.util.Set;

/**
 * Created by siddarthapeteti on 9/20/2016.
 */
public class RecordSerializer extends JsonSerializer<Record> {

    @Override
    public void serialize(Record record, JsonGenerator jsonGenerator, SerializerProvider serializers) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("id", record.getId());
        jsonGenerator.writeStringField("name", record.getName());
        jsonGenerator.writeBooleanField("folder", record.isFolder());
        jsonGenerator.writeBooleanField("trashed", record.isTrashed());
        int children = 0;
        if (record.getChildren() != null) {
            children = record.getChildren().size();
        }
        jsonGenerator.writeNumberField("children", children);
        if (record.getParent() == null) {
            jsonGenerator.writeObjectField("parent", null);
        } else {
            jsonGenerator.writeNumberField("parent", record.getParent().getId());
        }

        jsonGenerator.writeFieldName("tags");
        jsonGenerator.writeStartArray();
        Set<Tag> tags = record.getTags();
        if (tags != null) {
            tags.stream().map(tag -> (tag.getTag())).forEach(s -> {
                try {
                    jsonGenerator.writeString(s);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });

        }
        jsonGenerator.writeEndArray();
        jsonGenerator.writeEndObject();
    }
}
