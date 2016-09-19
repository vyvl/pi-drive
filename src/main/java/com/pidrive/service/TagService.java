package com.pidrive.service;

import com.pidrive.model.Record;
import com.pidrive.model.Tag;
import com.pidrive.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by siddarthapeteti on 9/19/2016.
 */
@Service
@Repository
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public List<Record> findRecordsByTag(String tag){
        List<Tag> tags = tagRepository.findByTag(tag);
        List<Record> records = tags.stream().map(tag1 -> (tag1.getRecord())).collect(Collectors.toList());
        return records;
    }
}
