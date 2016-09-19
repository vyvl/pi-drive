package com.pidrive.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

/**
 * Created by siddarthapeteti on 9/19/2016.
 */
@Entity
public class Tag {
    @Id
    @GeneratedValue
    @Column(name = "TAG_ID")
    private long tagId;

    private String tag;

    @ManyToOne
    @JoinColumn(name = "RECORD_ID", referencedColumnName = "RECORD_ID")
    @JsonIgnore
    private Record record;

    public long getTagId() {
        return tagId;
    }

    public void setTagId(long tagId) {
        this.tagId = tagId;
    }

    public Record getRecord() {
        return record;
    }

    public void setRecord(Record record) {
        this.record = record;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}
