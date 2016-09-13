package com.pidrive.repository;

import com.pidrive.model.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by SiddarthaPeteti on 9/11/2016.
 */
@Transactional
public interface RecordRepository extends JpaRepository<Record,Long>{

}
