package com.pidrive.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.pidrive.exception.RecordNotFoundException;
import com.pidrive.model.Serializer.RecordSerializer;
import com.pidrive.service.RecordService;
import org.hibernate.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.IOException;
import java.util.List;
import java.util.Set;

/**
 * Created by SiddarthaPeteti on 9/11/2016.
 */
@Table
@Entity
@JsonDeserialize(using = RecordDeserializer.class)
@JsonSerialize(using = RecordSerializer.class)
public class Record {
    @Id
    @GeneratedValue
    @Column(name = "RECORD_ID")
    private long id;

    private String name;

    private boolean isFolder;

    private boolean isTrashed;

    @ManyToOne
    @JoinColumn(referencedColumnName = "RECORD_ID")
    @JsonIgnore
    private Record parent;

    @OneToMany(mappedBy = "parent")
    @Cascade(org.hibernate.annotations.CascadeType.DELETE)
    @JsonIgnore
    private List<Record> children;

    @OneToOne(mappedBy = "record", cascade = CascadeType.MERGE)
    @Cascade(org.hibernate.annotations.CascadeType.DELETE)
    private FileContent content;

    @OneToMany(mappedBy = "record")
    @Cascade(org.hibernate.annotations.CascadeType.DELETE)
    @JsonIgnore
    private Set<Tag> tags;

    @OneToMany(mappedBy = "record")
    @Cascade(org.hibernate.annotations.CascadeType.DELETE)
    @JsonIgnore
    private Set<SharedRecord> sharedRecords;

    public FileContent getContent() {
        return content;
    }

    public void setContent(FileContent content) {
        this.content = content;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isFolder() {
        return isFolder;
    }

    public void setFolder(boolean folder) {
        this.isFolder = folder;
    }

    public Record getParent() {
        return parent;
    }

    public void setParent(Record parent) {
        if(parent.isFolder()) {
            this.parent = parent;
        }
        else {
            this.parent = null;
        }
    }

    public List<Record> getChildren() {
        return children;
    }

    public void setChildren(List<Record> children) {
        this.children = children;
    }


    public boolean isTrashed() {
        return isTrashed;
    }

    public void setTrashed(boolean trashed) {
        isTrashed = trashed;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}

class RecordDeserializer extends JsonDeserializer<Record> {

    @Autowired
    private RecordService recordService;
    @Override
    public Record deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        Record record = new Record();
        JsonNode recordNode =  p.getCodec().readTree(p);
        record.setName(recordNode.get("name").asText());
        record.setFolder(recordNode.get("folder").asBoolean());
        Record parent;
        JsonNode parentNode = recordNode.get("parent");
        if(!parentNode.isNull()){
            try {
                parent = recordService.getRecord(parentNode.asLong());
                record.setParent(parent);
            }
            catch (RecordNotFoundException r){
                throw  new RecordNotFoundException("Parent Record Not Found.");
            }
        }
        return record;
    }
}

