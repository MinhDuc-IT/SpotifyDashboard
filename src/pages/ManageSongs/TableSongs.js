import React, { useEffect, useState, useRef } from "react";
import { getAllSongs, deleteSong } from "../../services/songService";
import ManageSongs from "./ManageSongs";

function TableSongs() {
  const [songs, setSongs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    setSongs([
      {
        songID: 1,
        songName: "Song One",
        playCount: 150,
        image: "https://placehold.co/100?text=Image+1",
        audio: "https://res.cloudinary.com/dswyuiiqp/raw/upload/v1744037930/spotify_audio/rilmkaezwauamaojztxu.mp3",
      },
      {
        songID: 2,
        songName: "Song Two",
        playCount: 98,
        image: "https://placehold.co/100?text=Image+2",
        audio: "https://res.cloudinary.com/dswyuiiqp/raw/upload/v1744037930/spotify_audio/rilmkaezwauamaojztxu.mp3",
      },
      {
        songID: 3,
        songName: "Song Three",
        playCount: 210,
        image: "https://placehold.co/100?text=Image+3",
        audio: "https://res.cloudinary.com/dswyuiiqp/raw/upload/v1744037930/spotify_audio/rilmkaezwauamaojztxu.mp3",
      },
    ]);
  }, []);

  const audioRefs = useRef([]);

  const handlePlay = (index) => {
    audioRefs.current.forEach((audio, i) => {
      if (i !== index && audio && !audio.paused) {
        audio.pause();
        //audio.currentTime = 0;
      }
    });
  };  

  useEffect(() => {
    // Gọi API để lấy danh sách bài hát
    const fetchSongs = async () => {
      try {
        const data = await getAllSongs();
        setSongs(data); // Lưu danh sách bài hát vào state
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  const handleDelete = async (songID) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      try {
        await deleteSong(songID);
        setSongs((prevSongs) =>
          prevSongs.filter((song) => song.songID !== songID)
        );
        alert("Song deleted successfully!");
      } catch (error) {
        console.error("Error deleting song:", error);
        alert("Failed to delete song.");
      }
    }
  };

  const handleEdit = (songID) => {
    alert(`Edit functionality for Song ID: ${songID} is not implemented yet.`);
  };

  const handleCreate = () => {
    //window.location.href='/manage-song'
    setShowCreateForm(true);
  };

  return (
    <div className="w-full">
      {showCreateForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-[70vw] max-h-[95vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <ManageSongs onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}

      <div className="flex mb-5 justify-between">
        <h2 className="text-lg font-semibold mb-4">Song Management</h2>
        <button onClick={handleCreate} className=" rounded-md bg-black px-5 hover:bg-gray-700 text-white">Create new song</button>
      </div>
      <table className="min-w-full border-collapse border border-gray-300 relative">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Song ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Play Count
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left w-32">
              Image
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left w-48">
              Audio
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <tr key={song.songID} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {song.songID}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {song.songName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {song.playCount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={song.image}
                    alt={song.songName}
                    className="w-24 h-24 object-cover rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 w-48">
                  <audio 
                    ref = {(el)=>(audioRefs.current[index] = el)}
                    controls 
                    className="w-full w-[300px] h-10 relative z-0"
                    onPlay = {() => handlePlay(index)}
                  >
                    <source src={song.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  {/* <audio
                  ref={(el) => (audioRefs.current[index] = el)}
                  controls
                  onPlay={() => handlePlay(index)}
                  className="w-full"
                >
                  <source src={song.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio> */}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(song.songID)}
                    className="mr-2 rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(song.songID)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="border border-gray-300 px-4 py-2 text-center text-gray-500"
              >
                No songs available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TableSongs;
