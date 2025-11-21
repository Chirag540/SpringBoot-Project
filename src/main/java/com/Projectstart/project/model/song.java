package com.Projectstart.project.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
public class song {
    @Id
    private String id;

    private String title;
    private String artist;
    private Mood mood;
    private String url; // YouTube/Spotify link

    public song(String title, String artist, Mood mood, String url) {
        this.title = title;
        this.artist = artist;
        this.mood = mood;
        this.url = url;
    }
}

