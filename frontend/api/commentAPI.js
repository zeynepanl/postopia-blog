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

        toggleLike: (commentId, token) =>
    axios.post(`${API_URL}/like`, { commentId }, {
      headers: { Authorization: `Bearer ${token}` }
    }),

    replyToComment: (commentId, text, token) =>
      axios.post(`${API_URL}/reply`, { commentId, text }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),

        // ✅ Yorum Güncelleme API
        updateComment: (commentId, text, token) =>
          axios.put(`${API_URL}/update`, { commentId, text }, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
      
        // ✅ Yorum Silme API
        deleteComment: (commentId, token) =>
          axios.delete(`${API_URL}/delete/${commentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

    
};

export default commentAPI;