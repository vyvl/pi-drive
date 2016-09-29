package com.pidrive.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.pidrive.model.DeSerializer.SharedRecordDeserializer;
import com.pidrive.model.Serializer.RecordSerializer;
import com.pidrive.model.Serializer.SharedRecordSerializer;
import com.pidrive.service.RecordService;
import com.pidrive.service.UserService;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;

/**
 * Created by siddarthapeteti on 9/14/2016.
 */
@Table(name = "Shared_Records")
@Entity
//@JsonSerialize(using = SharedRecordSerializer.class)
@JsonDeserialize(using = SharedRecordDeserializer.class)
public class SharedRecord {
    @Id
    @GeneratedValue
    @Column(name="Share_ID")
    private long id;

    @ManyToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "RECORD_ID", referencedColumnName = "RECORD_ID")
    private Record record;

    public int getPermission() {
        return permission;
    }

    public void setPermission(int permission) {
        this.permission = permission;
    }

    private int permission; //0-Owner 1-Write 2-Read

    public SharedRecord() {
    }

    public SharedRecord(String username, long recordId, int permission){
        this.record = new RecordService().getRecord(recordId);
        this.user= new UserService().findUser(username);
        this.permission = permission;
    }

    public Record getRecord() {
        return record;
    }

    public void setRecord(Record record) {
        this.record = record;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
