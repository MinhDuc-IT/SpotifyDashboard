import axiosInstance from "../utils/AxiosCustomize";

// API để lấy danh sách bài hát
export const getAllSongs = async () => {
  return await axiosInstance.get("/api/song");
};

// API để thêm bài hát mới
export const addSong = async (songData) => {
  const formData = new FormData();
  formData.append("songName", songData.songName);
  formData.append("Audio", songData.audio);
  formData.append("Image", songData.image);

  return await axiosInstance.post("/api/song/create", formData);
};

// API để xóa bài hát
export const deleteSong = async (songId) => {
  try {
    const response = await axiosInstance.delete(`/songs/${songId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
