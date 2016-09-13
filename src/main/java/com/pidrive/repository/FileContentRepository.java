package com.pidrive.repository;

import com.pidrive.model.FileContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by SiddarthaPeteti on 9/12/2016.
 */
@Repository
public interface FileContentRepository extends JpaRepository<FileContent,Long>{

}
