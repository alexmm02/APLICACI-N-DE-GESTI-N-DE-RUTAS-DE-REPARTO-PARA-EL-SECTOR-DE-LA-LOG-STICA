import { pool } from "../db.js";

export async function createCompany({ name, createdBy, joinCode }) {
  const result = await pool.query(
    "INSERT INTO companies (name, created_by, join_code) VALUES ($1, $2, $3) RETURNING *",
    [name, createdBy, joinCode]
  );
  return result.rows[0];
}


export const getCompanyById = async (id) => {
  const result = await pool.query(
    "SELECT name FROM companies WHERE id = $1 AND deleted = FALSE",
    [id]
  );
  return result.rows[0] || null;
};


export const getCompaniesByOwner = async (ownerId) => {
  const result = await pool.query(
    "SELECT id, name, join_code FROM companies WHERE created_by = $1 AND deleted = FALSE",
    [ownerId]
  );
  return result.rows;
};

export const verifyCompanyOwnership = async (companyId, ownerId) => {
  const result = await pool.query(
    "SELECT id FROM companies WHERE id = $1 AND created_by = $2 AND deleted = FALSE",
    [companyId, ownerId]
  );
  return result.rowCount > 0;
};

export const getEmployeesByCompanyId = async (companyId) => {
  const result = await pool.query(
    "SELECT id, name, email, role, is_verified FROM users WHERE company_id = $1 AND deleted = FALSE",
    [companyId]
  );
  return result.rows;
};

export const getUserInCompany = async (userId, companyId) => {
  const result = await pool.query(
    `SELECT id, name, email, role, is_verified
     FROM users
     WHERE id = $1 AND company_id = $2 AND deleted = FALSE`,
    [userId, companyId]
  );
  return result.rows[0] || null;
};


export const removeEmployeesFromCompany = async (companyId) => {
  await pool.query("UPDATE users SET company_id = NULL WHERE company_id = $1", [companyId]);
};

export const deleteCompanyById = async (companyId) => {
  const result = await pool.query(`UPDATE companies SET deleted = TRUE WHERE id = $1 AND deleted = FALSE RETURNING *`, [companyId]);
  return result.rows[0];
};


export const isCompanyOwnedByUser = async (companyId, ownerId) => {
  const result = await pool.query(
    "SELECT 1 FROM companies WHERE id = $1 AND created_by = $2 AND deleted = FALSE",
    [companyId, ownerId]
  );
  return result.rowCount > 0;
};

export const isUserInCompany = async (userId, companyId) => {
  const result = await pool.query(
    "SELECT 1 FROM users WHERE id = $1 AND company_id = $2",
    [userId, companyId]
  );
  return result.rowCount > 0;
};

export const removeUserFromCompany = async (userId) => {
  await pool.query("UPDATE users SET company_id = NULL WHERE id = $1", [userId]);
};

export const AdminGetAllCompanies = async () => {
  const result = await pool.query(`
    SELECT c.id, c.name, c.join_code, c.created_at, u.name AS owner_name, u.email AS owner_email
    FROM companies c
    LEFT JOIN users u ON c.created_by = u.id
    WHERE c.deleted = FALSE
    ORDER BY c.created_at DESC
  `);
  return result.rows;
};

export const AdminGetEmployeesByCompanyId = async (companyId) => {
  const result = await pool.query(
    `SELECT id, name, email, role, is_verified
     FROM users
     WHERE company_id = $1 AND deleted = FALSE`,
    [companyId]
  );
  return result.rows;
};

export const AdminDeleteCompanyById = async (companyId) => {
  await pool.query("UPDATE users SET company_id = NULL WHERE company_id = $1", [companyId]);

  const result = await pool.query(`UPDATE companies SET deleted = TRUE WHERE id = $1 AND deleted = FALSE RETURNING *`, [companyId]);

  return result.rows[0] || null;
};


export const adminGetUserInCompany = async (userId, companyId) => {
  const result = await pool.query(
    "SELECT id FROM users WHERE id = $1 AND company_id = $2 AND deleted = FALSE",
    [userId, companyId]
  );
  return result.rows[0] || null;
};

export const adminRemoveUserFromCompany = async (userId) => {
  await pool.query("UPDATE users SET company_id = NULL WHERE id = $1", [userId]);
};

export const AdminGetCompanyById = async (companyId) => {
  const result = await pool.query(
    "SELECT id, name FROM companies WHERE id = $1",
    [companyId]
  );
  return result.rows[0]; 
};
