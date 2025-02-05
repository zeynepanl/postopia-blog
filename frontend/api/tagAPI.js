import apiClient from "./apiClient";

export const fetchTags = async (token) => {
  try {
    const response = await apiClient.post(
      "/tags",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Etiketleri alırken hata:", error);
    throw error;
  }
};

export const addTagAPI = async (newTag, token) => {
  try {
    const response = await apiClient.post(
      "/tags/create",
      { name: newTag },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Etiket eklenirken hata:", error);
    throw error;
  }
};
