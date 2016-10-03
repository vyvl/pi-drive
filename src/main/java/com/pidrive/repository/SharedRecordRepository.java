package com.pidrive.repository;

import com.pidrive.model.Record;
import com.pidrive.model.SharedRecord;
import com.pidrive.model.User;
import org.springframework.boot.autoconfigure.integration.IntegrationAutoConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by siddarthapeteti on 9/14/2016.
 */
@Repository
@Transactional
public interface SharedRecordRepository extends JpaRepository<SharedRecord,Long> {
    public List<SharedRecord> findByUser(User user);
    public List<SharedRecord> findByUserAndPermissionIn(User user,List<Integer> Permission);
    public List<SharedRecord> findByUserAndRecordIsTrashed(User user, boolean isTrashed);
    public List<SharedRecord> findByUserAndRecordIn(User user, List<Record> records);
}
