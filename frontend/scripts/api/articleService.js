import { apiClient } from "../utils/apiClient.js";

export const articleService = {
  /**
   * ดึงบทความแนะนำ 5 อันดับแรก (เรียงตามยอดวิว)
   * GET /article/recommend
   */
  recommandArticle: async () => {
    return await apiClient.get("/article/recommend");
  },

  /**
   * ค้นหาบทความตาม Tag (เช่น "Beginner Guide", "Deep Dive")
   * GET /article/search?tag=...
   */
  searchByTag: async (tag) => {
    return await apiClient.get(
      `/article/search?tag=${encodeURIComponent(tag)}`
    );
  },

  /**
   * ดึงข้อมูลบทความรายตัว
   * GET /article/:id
   */
  readArticle: async (id) => {
    return await apiClient.get(`/article/${id}`);
  },

  /**
   * อัปเดตยอดวิว
   * PUT /article/:id/view
   */
  updateViewer: async (id) => {
    return await apiClient.put(`/article/${id}/view`);
  },

  /**
   * ดึงคอมเมนต์ทั้งหมดของบทความนั้น
   * GET /article/:id/comments
   */
  getComments: async (articleId) => {
    return await apiClient.get(`/article/${articleId}/comments`);
  },

  /**
   * สร้างคอมเมนต์ใหม่ (ต้อง Login)
   * POST /article/:id/comments
   */
  createComment: async (articleId, userId, comment) => {
    return await apiClient.post(`/article/${articleId}/comments`, {
      userId, // ส่ง userId ไปด้วย
      comment,
    });
  },
  
  deleteComment: async (commentId) => {
    return await apiClient.delete(`/article/comments/${commentId}`);
  },

  //  เพิ่ม: แก้ไขคอมเมนต์
  updateComment: async (commentId, newContent) => {
    return await apiClient.put(`/article/comments/${commentId}`, {
      comment: newContent, // Backend รอรับ key ชื่อ "comment"
    });
  },
};
