package com.pidrive.repository;

import com.pidrive.model.SharedRecord;
import com.pidrive.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by siddarthapeteti on 9/14/2016.
 */
public interface SharedRecordRepository extends JpaRepository<SharedRecord,Long> {
    public List<SharedRecord> findByUser(User user);
}
