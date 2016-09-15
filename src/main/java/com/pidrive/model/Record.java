package com.pidrive.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.List;

/**
 * Created by SiddarthaPeteti on 9/11/2016.
 */
@Table
@Entity
public class Record {
    @Id
    @GeneratedValue
    @Column(name = "id")
    private long id;

    private String name;

    private boolean isFolder;

    private boolean isTrashed;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    @JsonIgnore
    private Record parent;

    @OneToMany(mappedBy = "parent")
    @Cascade(org.hibernate.annotations.CascadeType.DELETE)
    @JsonIgnore
    private List<Record> children;

    @OneToOne(mappedBy = "record", cascade = CascadeType.MERGE)
    @Cascade(org.hibernate.annotations.CascadeType.DELETE)
    private FileContent content;


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
        this.parent = parent;
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
}
