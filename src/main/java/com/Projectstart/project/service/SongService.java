package com.Projectstart.project.service;

import com.Projectstart.project.model.Mood;
import com.Projectstart.project.model.song;
import com.Projectstart.project.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SongService {

    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    // Add a new song
    public song addSong(song Song) {
        return songRepository.save(Song);
    }

    // Get songs by mood
    public List<song> getSongsByMood(Mood mood) {
        return songRepository.findByMood(mood);
    }

    // Get all songs
    public List<song> getAllSongs() {
        return songRepository.findAll();
    }
}

