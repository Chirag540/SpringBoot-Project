package com.Projectstart.project.controller;
import com.Projectstart.project.model.Mood;
import com.Projectstart.project.model.song;
import com.Projectstart.project.service.SongService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@CrossOrigin("*") // Allow frontend calls
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    // Add a new song (POST)
    @PostMapping("/add")
    public song addSong(@RequestBody song Song) {
        return songService.addSong(Song);
    }

    // Get all songs (GET)
    @GetMapping("/all")
    public List<song> getAllSongs() {
        return songService.getAllSongs();
    }

    // Get songs by mood (GET)
    @GetMapping("/by-mood")
    public List<song> getSongsByMood(@RequestParam Mood mood) {
        return songService.getSongsByMood(mood);
    }
}


