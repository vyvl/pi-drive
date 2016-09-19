package com.pidrive.repository;

import com.pidrive.model.Record;
import com.pidrive.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by siddarthapeteti on 9/19/2016.
 */
@Transactional
public interface TagRepository extends JpaRepository<Tag,Long>{
    public Tag findByRecordAndTag(Record record, String tag);
    public List<Tag> findByTag(String tag);
}
