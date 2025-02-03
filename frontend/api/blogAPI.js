import axios from 'axios';

const API_URL = "http://localhost:5000/api/blogs"; 

const blogAPI = {
  //Blog ekleme
  createBlog: (blogData, token) =>
    axios.post(`${API_URL}/create`, blogData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, //token burada ekleniyor
      },
    }),

  //Tüm blogları getirme
  getBlogs: () => axios.get(`${API_URL}`),
};

export default blogAPI;
