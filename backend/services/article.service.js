import db from "../utils/connectDB.js";

const articleService = {
  //  ค้นหาร้านที่จะเอาไปแสดงที่หน้าแรกเป็น recommendation
  recommandArticle: async () => {
    try {
      const query = `
        SELECT id, title, views, cover_image, tags, created_at
        FROM articles
        ORDER BY views DESC 
        LIMIT 5;`;

      const { rows } = await db.query(query);
      return rows;
    } catch (err) {
      console.error("Error in recommandArticle service: ", err);
      throw err;
    }
  },

  // Search using JSONB tags (e.g., 'Beginner Guide', 'Deep Dive')
  // ใช้ฟิลเตอร์เพื่อแยกหมวดหมู่เนื้อหาที่จะแสดงของแจ่ละ หมวดหมู่
  searchByTag: async (tag) => {
    try {
      const query = `
        SELECT id, title, cover_image, views, created_at, tags
        FROM articles
        WHERE tags ? $1
        ORDER BY views DESC`;

      const { rows } = await db.query(query, [tag]);
      return rows;
    } catch (err) {
      console.error("Error in searchByTag service: ", err);
      throw err;
    }
  },
  // ใช้เพิ่มยอดคนอ่าน เมื่อมีคนกดอ่าน article
  updateViewer: async (id) => {
    try {
      const query = ` 
        UPDATE articles 
        SET views = views + 1 
        WHERE id = $1
        RETURNING *;`;

      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (err) {
      console.error("Error in updateViewer service: ", err);
      throw err;
    }
  },
  // ใช้ดึงข้อมูลของ article ที่ user กดเข้าไปอ่าน เพื่อสร้างหน้าสำหรับอ่าน
  readArticle: async (id) => {
    try {
      const query = `
        SELECT a.*, u.username as author_name 
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.id = $1
      `;

      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (err) {
      console.error("Error in readArticle service: ", err);
      throw err;
    }
  },
  // สร้างคอมเม้น
  comment: async (articleId, userId, content) => {
    try {
      const query = `
        INSERT INTO article_comments (article_id, user_id, content) 
        VALUES ($1, $2, $3)
        RETURNING *;`;

      const { rows } = await db.query(query, [articleId, userId, content]);
      return rows[0];
    } catch (err) {
      console.error("Error in comment service: ", err);
      throw err;
    }
  },
  // ดึงคอมเม้นใน article
  getComment: async (articleId) => {
    try {
      const query = `
        SELECT 
            ac.id, 
            ac.content, 
            ac.created_at, 
            u.id AS user_id, 
            u.username 
        FROM article_comments ac
        JOIN users u ON ac.user_id = u.id
        WHERE ac.article_id = $1
        ORDER BY ac.created_at DESC`;

      const { rows } = await db.query(query, [articleId]);
      return rows;
    } catch (err) {
      console.error("Error in getComment service: ", err);
      throw err;
    }
  },
  
  deleteComment: async (commentId, userId) => {
    try {
      const query = `
        DELETE FROM article_comments 
        WHERE id = $1 AND user_id = $2
        RETURNING *;`; // RETURNING * เพื่อเอาไว้เช็คว่าลบจริงไหม

      const { rows } = await db.query(query, [commentId, userId]);

      return rows[0];
    } catch (err) {
      console.error("Error in deleteComment service: ", err);
      throw err;
    }
  },

  // เพิ่ม: แก้ไขคอมเมนต์ 
  updateComment: async (commentId, userId, newContent) => {
    try {
      const query = `
        UPDATE article_comments 
        SET content = $1
        WHERE id = $2 AND user_id = $3
        RETURNING *;`;

      const { rows } = await db.query(query, [newContent, commentId, userId]);
      return rows[0];
    } catch (err) {
      console.error("Error in updateComment service: ", err);
      throw err;
    }
  },
};

export default articleService;
