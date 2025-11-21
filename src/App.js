import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

function App() {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState("light");

  const [newSong, setNewSong] = useState({ title: "", artist: "", mood: "", audioFile: null, thumbnail: null });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioRef, setAudioRef] = useState(null);

  // Fetch moods
  useEffect(() => {
    axios.get("http://localhost:8080/api/moods")
      .then(res => setMoods(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch songs
  const fetchSongs = () => {
    let url = selectedMood ? `http://localhost:8080/api/songs/by-mood?mood=${selectedMood}` : "http://localhost:8080/api/songs/all";
    axios.get(url)
      .then(res => setSongs(res.data))
      .catch(err => console.error(err));
  };

  // Dropzones
  const { getRootProps: getAudioProps, getInputProps: getAudioInput } = useDropzone({
    accept: { "audio/*": [] },
    onDrop: files => setNewSong({ ...newSong, audioFile: files[0] })
  });
  const { getRootProps: getThumbProps, getInputProps: getThumbInput } = useDropzone({
    accept: { "image/*": [] },
    onDrop: files => setNewSong({ ...newSong, thumbnail: files[0] })
  });

  // Upload new song
  const addSong = async (e) => {
    e.preventDefault();
    if (!newSong.title || !newSong.artist || !newSong.mood || !newSong.audioFile) {
      toast.error("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newSong.title);
    formData.append("artist", newSong.artist);
    formData.append("mood", newSong.mood);
    formData.append("file", newSong.audioFile);
    if (newSong.thumbnail) formData.append("thumbnail", newSong.thumbnail);

    try {
      await axios.post("http://localhost:8080/api/songs/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: event => setUploadProgress(Math.round((event.loaded * 100) / event.total))
      });
      toast.success("Song uploaded successfully!");
      setNewSong({ title: "", artist: "", mood: "", audioFile: null, thumbnail: null });
      setUploadProgress(0);
      fetchSongs();
    } catch (err) {
      console.error(err);
      toast.error("Error uploading song!");
    }
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playSong = (index) => {
    setCurrentIndex(index);
    if (audioRef) {
      audioRef.pause();
      audioRef.load();
      audioRef.play();
    }
  };

  const nextSong = () => playSong((currentIndex + 1) % filteredSongs.length);
  const prevSong = () => playSong((currentIndex - 1 + filteredSongs.length) % filteredSongs.length);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", background: theme === "light" ? "#f0f4f7" : "#1e1e1e", color: theme === "light" ? "#000" : "#fff" }}>
      <ToastContainer />
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Mood Music App 🎵</h1>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button onClick={toggleTheme} style={{ marginBottom: 10, padding: "8px 15px", borderRadius: 5, cursor: "pointer" }}>
          Toggle {theme === "light" ? "Dark" : "Light"} Theme
        </button>
      </div>

      {/* Search & Mood filter */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <input type="text" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: 10, fontSize: 16, width: 250, borderRadius: 5, marginRight: 10 }} />
        <select value={selectedMood} onChange={e => setSelectedMood(e.target.value)} style={{ padding: 10, borderRadius: 5, marginRight: 10 }}>
          <option value="">-- Filter by Mood --</option>
          {moods.map(mood => <option key={mood.id} value={mood.name}>{mood.name}</option>)}
        </select>
        <button onClick={fetchSongs} style={{ padding: 10, borderRadius: 5 }}>Apply</button>
      </div>

      {/* Songs grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 20, marginBottom: 40 }}>
        {filteredSongs.map((song, index) => (
          <div key={song.id} style={{
            padding: 15, borderRadius: 10, boxShadow: theme === "light" ? "0 4px 12px rgba(0,0,0,0.1)" : "0 4px 12px rgba(255,255,255,0.1)",
            backgroundColor: theme === "light" ? "#fff" : "#333",
            textAlign: "center",
            transition: "transform 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {song.thumbnail && <img src={song.thumbnail} alt="thumb" style={{ width: "100%", borderRadius: 10, marginBottom: 10 }} />}
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
            {song.url &&
              <>
                <audio ref={ref => setAudioRef(ref)} controls style={{ width: "100%" }}>
                  <source src={song.url} type="audio/mpeg" />
                </audio>
                <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 10 }}>
                  <button onClick={prevSong}><SkipPreviousIcon /></button>
                  <button onClick={() => playSong(index)}><PlayArrowIcon /></button>
                  <button onClick={nextSong}><SkipNextIcon /></button>
                </div>
              </>
            }
          </div>
        ))}
      </div>

      {/* Add song form */}
      <div style={{ maxWidth: 500, margin: "0 auto", padding: 20, borderRadius: 10, backgroundColor: theme === "light" ? "#fff" : "#333", boxShadow: theme === "light" ? "0 4px 12px rgba(0,0,0,0.1)" : "0 4px 12px rgba(255,255,255,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Add New Song 🎶</h2>
        <form onSubmit={addSong} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="text" placeholder="Song Title" value={newSong.title} onChange={e => setNewSong({ ...newSong, title: e.target.value })} style={{ padding: 10, borderRadius: 5 }} />
          <input type="text" placeholder="Artist" value={newSong.artist} onChange={e => setNewSong({ ...newSong, artist: e.target.value })} style={{ padding: 10, borderRadius: 5 }} />
          <select value={newSong.mood} onChange={e => setNewSong({ ...newSong, mood: e.target.value })} style={{ padding: 10, borderRadius: 5 }}>
            <option value="">-- Select Mood --</option>
            {moods.map(mood => <option key={mood.id} value={mood.name}>{mood.name}</option>)}
          </select>

          <div {...getAudioProps()} style={{ padding: 20, border: "2px dashed #3498db", borderRadius: 5, textAlign: "center", cursor: "pointer" }}>
            <input {...getAudioInput()} />
            {newSong.audioFile ? `Audio: ${newSong.audioFile.name}` : "Drag & drop audio or click"}
          </div>

          <div {...getThumbProps()} style={{ padding: 20, border: "2px dashed #9b59b6", borderRadius: 5, textAlign: "center", cursor: "pointer" }}>
            <input {...getThumbInput()} />
            {newSong.thumbnail ? `Image: ${newSong.thumbnail.name}` : "Drag & drop thumbnail or click"}
          </div>

          {uploadProgress > 0 && <div style={{ marginTop: 10, background: "#ecf0f1", borderRadius: 5 }}>
            <div style={{ width: `${uploadProgress}%`, background: "#2ecc71", height: 10, borderRadius: 5 }}></div>
          </div>}

          <button type="submit" style={{ padding: 12, backgroundColor: "#2ecc71", color: "#fff", borderRadius: 5 }}>Upload Song</button>
        </form>
      </div>
    </div>
  );
}

export default App;
