package com.pidrive.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GeneratorType;

import javax.persistence.*;
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

    private boolean folder;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    @JsonIgnore
    private Record parent;

    @OneToMany(mappedBy = "parent")
    private List<Record> children;

    @OneToOne(mappedBy = "record", cascade = CascadeType.MERGE)
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
        return folder;
    }

    public void setFolder(boolean folder) {
        this.folder = folder;
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


}
