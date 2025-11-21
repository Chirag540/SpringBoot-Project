import React, { useEffect, useState } from "react";

function Mood() {
  const [songs, setSongs] = useState([]);
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/songs/all')
      .then(res => res.json())
      .then(data => {
        setSongs(data);
        const uniqueMoods = [...new Set(data.map(song => song.mood))];
        setMoods(uniqueMoods);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Select Mood</h2>
      <select>
        <option value="">Select Mood</option>
        {moods.map((mood, index) => (
          <option key={index} value={mood}>{mood}</option>
        ))}
      </select>
    </div>
  );
}

export default Mood;
