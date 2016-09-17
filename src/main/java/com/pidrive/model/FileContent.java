package com.pidrive.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.FetchMode;
import org.hibernate.annotations.Fetch;
import org.hibernate.type.Type;

import javax.persistence.*;

/**
 * Created by SiddarthaPeteti on 9/12/2016.
 */
@Table(name = "Contents")
@Entity
public class FileContent {
    @Id
    @GeneratedValue
    @Column(name = "CONTENT_ID")
    private long id;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] content;

    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "RECORD_ID", referencedColumnName = "RECORD_ID")
    @JsonIgnore
    private Record record;

    public Record getRecord() {
        return record;
    }

    public void setRecord(Record record) {
        this.record = record;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }
}
