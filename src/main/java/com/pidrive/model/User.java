package com.pidrive.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cascade;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.persistence.*;

@Table(name = "users")
@Entity
public class User{

    @Id
    @GeneratedValue
    @Column(name = "USER_ID")
    private long id;

    @Column(unique = true)
    private String username;
    @JsonIgnore
    private String password;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "root_id", referencedColumnName = "RECORD_ID")
    @Cascade(org.hibernate.annotations.CascadeType.DELETE)
    private Record root;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {

        this.password = new BCryptPasswordEncoder().encode(password);
    }

    public User(String username, String password){
        this.username = username;
        this.setPassword(password);
    }
    public User(){

    }

    public Record getRoot() {
        return root;
    }

    public void setRoot(Record root) {
        this.root = root;
    }
}
