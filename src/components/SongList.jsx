import React from "react";

function Song({ song }) {
  const audioRef = React.useRef(null);

  const handlePlay = () => {
    audioRef.current.play();
  };

  return (
    <div>
      <p>{song.title} by {song.artist}</p>
      {song.url && (
        <>
          <audio ref={audioRef} src={song.url}></audio>
          <button onClick={handlePlay}>Play</button>
        </>
      )}
    </div>
  );
}

export default Song;
