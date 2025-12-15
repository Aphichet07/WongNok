import db from "../utils/connectDB.js";

const shopService = {
  test: () => {
    return JSON.stringify({ message: "Hello from shopService", status: "OK" });
  },

  // ใช้ดึงร้านกาแฟที่แนะนำไปแสดงหน้า recommend
  getRecommended: async () => {
    try {
      const queryText = `
                SELECT * FROM shops
                ORDER BY average_rating DESC
                LIMIT 10
            `;
      const { rows } = await db.query(queryText);
      return rows;
    } catch (err) {
      console.error("Error in getRecommended:", err);
      throw err;
    }
  },

  // ใช้ค้นหาชื่อร่้านตรงหน้าแรก
  getShopByName: async (name) => {
    try {
      const queryText = `
                SELECT * FROM shops 
                WHERE name ILIKE $1 
                ORDER BY average_rating DESC
            `;
      const { rows } = await db.query(queryText, [`%${name}%`]);
      return rows;
    } catch (err) {
      console.error("Error in getShopByName:", err);
      throw err;
    }
  },

  // ไม่ต้องสนใจ
  getShopById: async (id) => {
    try {
      const queryText = `SELECT * FROM shops WHERE id = $1`;
      const { rows } = await db.query(queryText, [id]);
      return rows[0];
    } catch (err) {
      console.error("Error in getShopById:", err);
      throw err;
    }
  },

  // ใช้ filter ร้านกาแฟตรง filter bar
  filterShop: async (filters) => {
    const {
      roast,
      process,
      bean_type,
      price_range,
      flavor,
      ambience,
      origin,
      lat,
      lng,
    } = filters;

    let queryText = `SELECT *`;
    const queryValues = [];
    let whereClauses = ["1=1"];
    let orderClause = "ORDER BY average_rating DESC";

    if (lat && lng) {
      queryText += `,
                (6371 * acos(
                    cos(radians($${
                      queryValues.length + 1
                    })) * cos(radians(latitude)) * cos(radians(longitude) - radians($${
        queryValues.length + 2
      })) + 
                    sin(radians($${
                      queryValues.length + 1
                    })) * sin(radians(latitude))
                )) AS distance
            `;
      queryValues.push(parseFloat(lat), parseFloat(lng));

      orderClause = "ORDER BY distance ASC";
    }

    queryText += ` FROM shops`;

    if (roast) {
      const roasts = Array.isArray(roast) ? roast : [roast];
      whereClauses.push(`roast_level = ANY($${queryValues.length + 1})`);
      queryValues.push(roasts);
    }

    if (process) {
      const processes = Array.isArray(process) ? process : [process];
      whereClauses.push(`process = ANY($${queryValues.length + 1})`);
      queryValues.push(processes);
    }

    if (bean_type) {
      whereClauses.push(`bean_type = $${queryValues.length + 1}`);
      queryValues.push(bean_type);
    }

    if (flavor) {
      const flavors = Array.isArray(flavor) ? flavor : [flavor];
      whereClauses.push(`flavor_notes ?| $${queryValues.length + 1}`);
      queryValues.push(flavors);
    }

    if (ambience) {
      const ambiences = Array.isArray(ambience) ? ambience : [ambience];
      whereClauses.push(`ambience ?| $${queryValues.length + 1}`);
      queryValues.push(ambiences);
    }

    if (origin) {
      const origins = Array.isArray(origin) ? origin : [origin];
      whereClauses.push(`origin ?| $${queryValues.length + 1}`);
      queryValues.push(origins);
    }

    queryText += ` WHERE ${whereClauses.join(" AND ")} ${orderClause}`;

    try {
      console.log("Executing SQL:", queryText);
      console.log("Values:", queryValues);

      const { rows } = await db.query(queryText, queryValues);
      return rows;
    } catch (err) {
      console.error("Error executing filterShop query:", err);
      throw err;
    }
  },

  getNearbyShops: async (userLat, userLng, limit = 5) => {
    try {
      const query = `
        SELECT *, 
          ( 6371 * acos( cos( radians($1) ) * cos( radians( latitude ) ) 
          * cos( radians( longitude ) - radians($2) ) + sin( radians($1) ) 
          * sin( radians( latitude ) ) ) ) AS distance 
        FROM shops 
        ORDER BY distance ASC 
        LIMIT $3;
      `;

      const { rows } = await db.query(query, [userLat, userLng, limit]);
      return rows;
    } catch (err) {
      console.error("Error finding nearby shops:", err);
      throw err;
    }
  },

  searchGlobal: async (keyword) => {
    try {
      const searchTerm = `%${keyword}%`;

      const query = `
        SELECT * FROM shops
        WHERE 
          -- 1. ค้นจากชื่อและคำบรรยาย
          name ILIKE $1 
          OR description ILIKE $1
          OR address ILIKE $1
          OR area ILIKE $1
          
          -- 2. ค้นจากสเปคกาแฟ
          OR roast_level ILIKE $1
          OR bean_type ILIKE $1
          OR process ILIKE $1
          
          -- เทคนิค: แปลงก้อน Array ให้เป็น Text แล้วค้นหาดื้อๆ เลย
          OR CAST(flavor_notes AS TEXT) ILIKE $1
          OR CAST(ambience AS TEXT) ILIKE $1
          OR CAST(origin AS TEXT) ILIKE $1
      `;

      const { rows } = await db.query(query, [searchTerm]);
      return rows;
    } catch (err) {
      console.error("Search Error:", err);
      throw err;
    }
  },
};

export default shopService;
