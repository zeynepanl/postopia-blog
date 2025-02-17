import axios from "axios";

const API_URL = "http://localhost:5000/api/blogs";

const blogAPI = {
  // Blog ekleme
  createBlog: (blogData, token) =>
    axios.post(`${API_URL}/create`, blogData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Tüm blogları getirme
  getBlogs: () => axios.get(`${API_URL}`),

  // Kullanıcının kendi bloglarını getirme
  getUserBlogs: (token) =>
    axios.post(`${API_URL}/my-blogs`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }),


  // Tekil Blog Getirme (YENİ EKLENDİ)
  getBlogDetails: (blogId) =>
    axios.post(`${API_URL}/details`, { id: blogId }, {
      headers: {
        "Content-Type": "application/json",
      },
    }),

  // Blog güncelleme
  updateBlog: (blogData, token) =>
    axios.post(`${API_URL}/update`, blogData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }),

  // **Blog silme** (YENİ EKLENDİ)
  deleteBlog: (blogId, token) =>
    axios.post(
      `${API_URL}/delete`,
      { id: blogId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ),

    toggleLike: (blogId, token) =>
      axios.post(`${API_URL}/blogs/like`, { blogId }, {
        headers: { Authorization: `Bearer ${token}` }
      }),

      getLatestBlogs: () => axios.get(`${API_URL}/latest`),

      getPopularBlogs: () => axios.get(`${API_URL}/popular`),

      getBlogs: (token) =>
    axios.post(`${API_URL}/list`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),


  
};

export default blogAPI;



