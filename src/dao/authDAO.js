import { pool } from "../db.js";

export async function getUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1 AND deleted = FALSE", [email]);
  return result.rows[0];
}

export async function getUserIfExists(email) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

export async function getCompanyByJoinCode(code) {
  const result = await pool.query("SELECT id FROM companies WHERE join_code = $1", [code]);
  return result.rows[0];
}

export async function createUser(userData) {
  const { name, email, hashedPassword, verificationToken, role, companyId } = userData;
  const result = await pool.query(
    `INSERT INTO users(name, email, password, is_verified, verification_token, role, company_id)
     VALUES($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, email, hashedPassword, false, verificationToken, role, companyId]
  );
  return result.rows[0];
}

export async function getUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1 AND deleted = FALSE", [id]);
  return result.rows[0];
}

export async function updatePassword(userId, hashedPassword) {
  await pool.query("UPDATE users SET password = $1 WHERE id = $2 AND deleted = FALSE", [hashedPassword, userId]);
}

export async function setResetToken(email, token, expiration) {
  await pool.query(
    "UPDATE users SET reset_token = $1, reset_token_expiration = $2 WHERE email = $3 AND deleted = FALSE",
    [token, expiration, email]
  );
}

export async function getUserByResetToken(token) {
  const result = await pool.query(
    "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiration > NOW() AND deleted = FALSE",
    [token]
  );
  return result.rows[0];
}

export async function resetUserPassword(userId, hashedPassword) {
  await pool.query(
    "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiration = NULL WHERE id = $2 AND deleted = FALSE",
    [hashedPassword, userId]
  );
}

export async function updateProfile(userId, name, companyId) {
  const result = await pool.query(
    `UPDATE users 
     SET name = $1, company_id = $2, updated_at = NOW() 
     WHERE id = $3 AND deleted = FALSE 
     RETURNING *`,
    [name, companyId, userId]
  );
  return result.rows[0];
}

export async function getUserByVerificationToken(token) {
  const result = await pool.query("SELECT * FROM users WHERE verification_token = $1 AND deleted = FALSE", [token]);
  return result.rows[0];
}

export async function verifyUserEmail(userId) {
  await pool.query("UPDATE users SET is_verified = $1, verification_token = NULL WHERE id = $2 AND deleted = FALSE", [true, userId]);
}

export async function removeCompanyFromUser(userId) {
  await pool.query("UPDATE users SET company_id = NULL WHERE id = $1 AND deleted = FALSE", [userId]);
}

export async function deleteUser(id) {
  const result = await pool.query(`UPDATE users SET deleted = TRUE, company_id = NULL WHERE id = $1 AND deleted = FALSE RETURNING *`, [id]);
  return result.rows[0];
}

export async function AdminGetAllUsers() {
  const result = await pool.query(
    "SELECT id, name, email, role, is_verified FROM users WHERE deleted = FALSE"
  );
  return result.rows;
}

export async function AdminGetUserById(id) {
  const result = await pool.query(
    "SELECT id, name, email, role, is_verified FROM users WHERE id = $1 AND deleted = FALSE",
    [id]
  );
  return result.rows[0];
}

export async function AdminUpdateUser(id, name, role, isVerified) {
  const result = await pool.query(
    `UPDATE users 
     SET name = $1, role = $2, is_verified = $3, updated_at = NOW() 
     WHERE id = $4 AND deleted = FALSE 
     RETURNING id, name, email, role, is_verified`,
    [name, role, isVerified, id]
  );
  return result.rows[0];
}

export async function AdminDeleteUser(id) {
  const result = await pool.query(`UPDATE users SET deleted = TRUE, company_id = NULL WHERE id = $1 AND deleted = FALSE RETURNING *`, [id]);
  return result.rows[0];
}


export async function leaveCompany(userId) {
  const result = await pool.query(
    "UPDATE users SET company_id = NULL WHERE id = $1 AND deleted = FALSE RETURNING *",
    [userId]
  );
  return result.rows[0];
}
