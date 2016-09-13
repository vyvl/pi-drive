package com.pidrive.service;

import com.pidrive.model.Record;
import com.pidrive.model.User;
import com.pidrive.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by SiddarthaPeteti on 9/9/2016.
 */
@Service
@Repository
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User saveUser(User user){
        Record root = new Record();
        root.setFolder(true);
        root.setName(user.getUsername());
        user.setRoot(root);
        if (user != null) {

           user =  userRepository.saveAndFlush(user);
        }
        return user;
    }

    @Transactional
    public void deleteUser(String userName){
        userRepository.delete(userName);
    }

    @Transactional(readOnly = true)
    public User findUser(String userName){
        return userRepository.findOne(userName);
    }
}
