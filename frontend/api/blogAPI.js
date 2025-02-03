import axios from 'axios';

const API_URL = "http://localhost:5000/api/blogs"; 

const blogAPI = {
  //Blog ekleme
  createBlog: (blogData, token) =>
    axios.post(`${API_URL}/create`, blogData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }),

  //Tüm blogları getirme
  getBlogs: () => axios.get(`${API_URL}`),

  //Kullanıcının kendi bloglarını getirme (EKLE)
  getUserBlogs: (token) => 
    axios.post(`${API_URL}/my-blogs`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }),
};

export default blogAPI;
