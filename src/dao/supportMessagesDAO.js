// supportMessagesDAO.js

import { pool } from "../db.js";

// ============ USER FUNCTION ============

export async function createSupportMessageDAO(userId, category, message) {
  const result = await pool.query(
    "INSERT INTO support_messages (user_id, category, message) VALUES ($1, $2, $3) RETURNING *",
    [userId, category, message]
  );
  return result.rows[0];
}

// ============ ADMIN FUNCTIONS ============

export async function adminGetAllSupportMessagesDAO() {
  const result = await pool.query(
    "SELECT id, user_id, category, message, status, created_at FROM support_messages WHERE deleted = FALSE ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function adminGetSupportMessageByIdDAO(id) {
  const result = await pool.query(
    `SELECT sm.*, u.name AS user_name, u.email 
     FROM support_messages sm 
     JOIN users u ON sm.user_id = u.id 
     WHERE sm.id = $1 AND sm.deleted = FALSE`,
    [id]
  );
  return result.rows[0];
}

export async function adminUpdateSupportMessageStatusDAO(id, status) {
  const result = await pool.query(
    "UPDATE support_messages SET status = $1 WHERE id = $2 AND deleted = FALSE RETURNING *",
    [status, id]
  );
  return result.rows[0];
}

export async function adminDeleteSupportMessageDAO(id) {
  const result = await pool.query(
    "UPDATE support_messages SET deleted = TRUE WHERE id = $1 AND deleted = FALSE RETURNING *",
    [id]
  );
  return result.rows[0];
}
