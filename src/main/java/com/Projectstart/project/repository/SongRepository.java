package com.Projectstart.project.repository;

import com.Projectstart.project.model.Mood;
import com.Projectstart.project.model.song;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

 public interface SongRepository extends MongoRepository<song, String> {

        // Custom query to find songs by mood
        List<song> findByMood(Mood mood);
    }

