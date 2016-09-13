package com.pidrive.repository;

import com.pidrive.model.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pidrive.model.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by SiddarthaPeteti on 9/9/2016.
 */
@Transactional
public interface UserRepository extends JpaRepository<User,String>{
    public User findByUsername(String username);

}
