package com.pidrive.model;

import com.pidrive.service.RecordService;
import com.pidrive.service.UserService;

import javax.persistence.*;

/**
 * Created by siddarthapeteti on 9/14/2016.
 */
@Table(name = "Shared_Records")
@Entity
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

    private int permission;

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
}
