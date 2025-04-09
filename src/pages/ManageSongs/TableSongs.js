import React, { useEffect, useState } from "react";
import { getAllSongs, deleteSong } from "../../services/songService";

function TableSongs() {
  const [songs, setSongs] = useState([]);

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

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Song Management</h2>
      <table className="min-w-full border-collapse border border-gray-300 relative z-[-1]">
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
            songs.map((song) => (
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
                  <audio controls className="w-full h-10 relative z-0">
                    <source src={song.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
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
