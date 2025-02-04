import axios from "axios";

const API_URL = "http://localhost:5000/api/comments";

const commentAPI = {
  // Yorum ekleme
  createComment: (blogId, text, token) =>
    axios.post(
      `${API_URL}/add`, // Use backticks for template literals
      { blogId, text },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use backticks for template literals
        },
      }
    ),

    getComments: (blogId, token) =>
        axios.get(`${API_URL}/${blogId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
};

export default commentAPI;