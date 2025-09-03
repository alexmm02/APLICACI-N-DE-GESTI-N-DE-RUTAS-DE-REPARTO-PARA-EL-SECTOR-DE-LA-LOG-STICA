import { pool } from "../db.js";

export const getUserCompanyId = async (userId) => {
  const result = await pool.query("SELECT company_id FROM users WHERE id = $1", [userId]);
  return result.rows[0]?.company_id || null;
};

export const hasOpenClockIn = async (userId) => {
  const result = await pool.query(
    "SELECT id FROM time_entries WHERE user_id = $1 AND clock_out IS NULL",
    [userId]
  );
  return result.rowCount > 0;
};

export const clockIn = async (userId, companyId) => {
  const result = await pool.query(
    "INSERT INTO time_entries (user_id, company_id, clock_in) VALUES ($1, $2, NOW()) RETURNING *",
    [userId, companyId]
  );
  return result.rows[0];
};

export const getOpenClockEntry = async (userId) => {
  const result = await pool.query(
    "SELECT id FROM time_entries WHERE user_id = $1 AND clock_out IS NULL",
    [userId]
  );
  return result.rows[0] || null;
};

export const clockOut = async (entryId) => {
  const result = await pool.query(
    "UPDATE time_entries SET clock_out = NOW() WHERE id = $1 RETURNING *",
    [entryId]
  );
  return result.rows[0];
};

export const getTodayEntry = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM time_entries 
     WHERE user_id = $1 AND DATE(clock_in) = CURRENT_DATE
     ORDER BY clock_in DESC LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
};

export const getMonthlyEntries = async (userId, month, year) => {
  const result = await pool.query(
    `SELECT * FROM time_entries
     WHERE user_id = $1
       AND EXTRACT(MONTH FROM clock_in) = $2
       AND EXTRACT(YEAR FROM clock_in) = $3
     ORDER BY clock_in ASC`,
    [userId, month, year]
  );
  return result.rows;
};

export const OwnerGetUserCompanyId = async (userId) => {
  const result = await pool.query("SELECT company_id FROM users WHERE id = $1", [userId]);
  return result.rows[0]?.company_id || null;
};

export const OwnerCheckCompanyOwnership = async (companyId, ownerId) => {
  const result = await pool.query(
    "SELECT 1 FROM companies WHERE id = $1 AND created_by = $2",
    [companyId, ownerId]
  );
  return result.rowCount > 0;
};

export const OwnerGetUserMonthlyEntries = async (userId, month, year) => {
  const result = await pool.query(
    `SELECT * FROM time_entries
     WHERE user_id = $1
       AND EXTRACT(MONTH FROM clock_in) = $2
       AND EXTRACT(YEAR FROM clock_in) = $3
     ORDER BY clock_in ASC`,
    [userId, month, year]
  );
  return result.rows;
};

export const AdminGetUserMonthlyEntries = async (userId, month, year) => {
  const result = await pool.query(
    `SELECT * FROM time_entries
     WHERE user_id = $1
       AND EXTRACT(MONTH FROM clock_in) = $2
       AND EXTRACT(YEAR FROM clock_in) = $3
     ORDER BY clock_in ASC`,
    [userId, month, year]
  );
  return result.rows;
};
