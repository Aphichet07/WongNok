import { deflate } from "zlib";
import db from "../utils/connectDB.js";

const articleService = {
  recommandArticle: async () => {
    try {
      const query = `
        SELECT id, title, view_count, cover_image
        FROM articles
        ORDER BY view_count DESC 
        LIMIT 5;`;

      const { rows } = await db.query(query);
      return rows;
    } catch (err) {
      console.error("Error in getRecommended service: ", err);
      throw err;
    }
  },

  searchByCategory: async (category) => {
    try {
      const query = `
        SELECT id, title, cover_image, view_count, created_at, category
        FROM articles
        WHERE category ILIKE $1
        ORDER BY view_count DESC`;

      const { rows } = await db.query(query, [category]);
      return rows;
    } catch (err) {
      console.error("Error in getRecommended service: ", err);
      throw err;
    }
  },

  updateViewer: async (id) => {
    try {
      const query = ` 
        UPDATE articles 
        SET view_count = view_count + 1 
        WHERE id = $1;`;

      await db.query(query, [id]);
      const { rows } = await db.query("SELECT * FROM articles WHERE id = $1", [
        id,
      ]);
      return rows[0];
    } catch (err) {
      console.log("Error");
      throw err;
    }
  },
  readArticle: async (id)=>{
    try {
      const query = `select * from articles where id = $1`

      const {rows} = await db.query(query, [id])
      return rows[0]
    }catch(err){
      console.log("Error from Article Service : ", err)
      throw err
    }
  },

  comment: async (id, username, comment)=>{
    try {
      const query = `
        INSERT INTO article_comments (article_id, user_id, content) 
        VALUES ($1, $2, $3)
        RETURNING *;`

      const {rows} = await db.query(query, [id, username, comment])
      return rows[0]
    }catch(err){
      console.log("Error from Comment Service : ", err)
      throw err
    }
  },

  getComment: async (articleId) =>{
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
        ORDER BY ac.created_at DESC`


      const {rows} = await db.query(query, [articleId])
      console.log(rows)
      return rows
    }catch{
      console.log("Error from comment service :", err)
      throw err
    }
  }
};

export default articleService;
