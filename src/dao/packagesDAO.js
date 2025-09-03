import { pool } from "../db.js";

// =====================
// === USER FUNCTIONS ===
// =====================

export async function getAllPackages(userId) {
  const result = await pool.query(
    "SELECT * FROM packages WHERE user_id = $1 AND deleted = FALSE",
    [userId]
  );
  return result.rows;
}

export async function getPackageById(id, userId) {
  const result = await pool.query(
    "SELECT * FROM packages WHERE id = $1 AND user_id = $2 AND deleted = FALSE",
    [id, userId]
  );
  return result.rows[0];
}

export async function createPackage({
  name,
  description,
  priority,
  destinationAddress,
  latitude,
  longitude,
  userId,
}) {
  const result = await pool.query(
    `INSERT INTO packages (name, description, priority, destinationAddress, latitude, longitude, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, description, priority, destinationAddress, latitude, longitude, userId]
  );
  return result.rows[0];
}

export async function updatePackage({
  id,
  name,
  description,
  priority,
  destinationAddress,
  latitude,
  longitude,
}) {
  const result = await pool.query(
    `UPDATE packages 
     SET name = $1, description = $2, priority = $3, destinationAddress = $4, latitude = $5, longitude = $6
     WHERE id = $7 AND deleted = FALSE
     RETURNING *`,
    [name, description, priority, destinationAddress, latitude, longitude, id]
  );
  return result.rows[0];
}

export async function deletePackage(id) {
  const result = await pool.query( `UPDATE packages SET deleted = TRUE WHERE id = $1 AND deleted = FALSE RETURNING *`, [id]);
  return result.rows[0];
}

export async function markPackageAsDelivered(id) {
  const result = await pool.query(
    "UPDATE packages SET delivered = TRUE WHERE id = $1 AND deleted = FALSE RETURNING *",
    [id]
  );
  return result.rows[0];
}

export async function unmarkPackageAsDelivered(id) {
  const result = await pool.query(
    "UPDATE packages SET delivered = FALSE WHERE id = $1 AND deleted = FALSE RETURNING *",
    [id]
  );
  return result.rows[0];
}

// =======================
// === ADMIN FUNCTIONS ===
// =======================

export async function AdminGetAllPackages() {
  const result = await pool.query("SELECT * FROM packages WHERE deleted = FALSE ORDER BY id DESC");
  return result.rows;
}

export async function AdminGetPackageById(id) {
  const result = await pool.query("SELECT * FROM packages WHERE id = $1 AND deleted = FALSE", [id]);
  return result.rows[0];
}

export async function AdminUpdatePackage({
  id,
  name,
  destinationAddress,
  priority,
  latitude,
  longitude,
  userId,
}) {
  const result = await pool.query(
    `UPDATE packages
     SET name = $1, destinationAddress = $2, priority = $3, latitude = $4, longitude = $5, user_id = $6
     WHERE id = $7 AND deleted = FALSE RETURNING *`,
    [name, destinationAddress, priority, latitude, longitude, userId, id]
  );
  return result.rows[0];
}

export async function AdminDeletePackage(id) {
  const result = await pool.query(
    "UPDATE packages SET deleted = TRUE WHERE id = $1 AND deleted = FALSE RETURNING *",
    [id]
  );
  return result.rows[0];
}

export async function AdminCreatePackage({
  name,
  description,
  priority,
  destinationAddress,
  latitude,
  longitude,
  userId,
}) {
  const result = await pool.query(
    `INSERT INTO packages (name, description, priority, destinationAddress, latitude, longitude, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, description, priority, destinationAddress, latitude, longitude, userId]
  );
  return result.rows[0];
}

export async function AdminGetUserPackages(userId) {
  const result = await pool.query(
    "SELECT * FROM packages WHERE user_id = $1 AND deleted = FALSE",
    [userId]
  );
  return result.rows;
}

// =======================
// === OWNER FUNCTIONS ===
// =======================

export async function OwnerGetUserCompanyId(userId) {
  const result = await pool.query("SELECT company_id FROM users WHERE id = $1 AND deleted = FALSE", [userId]);
  return result.rows[0]?.company_id || null;
}

export async function OwnerCheckCompanyOwnership(companyId, ownerId) {
  const result = await pool.query(
    "SELECT * FROM companies WHERE id = $1 AND created_by = $2 AND deleted = FALSE",
    [companyId, ownerId]
  );
  return result.rowCount > 0;
}

export async function OwnerGetPackagesByUserId(userId) {
  const result = await pool.query("SELECT * FROM packages WHERE user_id = $1 AND deleted = FALSE", [userId]);
  return result.rows;
}

export async function OwnerGetPackageById(packageId, userId) {
  const result = await pool.query(
    "SELECT * FROM packages WHERE id = $1 AND user_id = $2 AND deleted = FALSE",
    [packageId, userId]
  );
  return result.rows[0] || null;
}


export async function OwnerInsertPackage({ name, description, priority, destinationAddress, latitude, longitude, userId }) {
  const result = await pool.query(
    `INSERT INTO packages (name, description, priority, destinationAddress, latitude, longitude, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, description, priority, destinationAddress, latitude, longitude, userId]
  );
  return result.rows[0];
}

export async function OwnerDeletePackageByUser(packageId, userId) {
  const result = await pool.query(
    "UPDATE packages SET deleted = TRUE WHERE id = $1 AND user_id = $2 AND deleted = FALSE RETURNING *",
    [packageId, userId]
  );
  return result.rows[0] || null;
}

export async function OwnerUpdatePackageByUser({
  packageId,
  userId,
  name,
  description,
  priority,
  destinationAddress,
  latitude,
  longitude,
}) {
  const result = await pool.query(
    `UPDATE packages
     SET name = $1, description = $2, priority = $3, destinationAddress = $4, latitude = $5, longitude = $6
     WHERE id = $7 AND user_id = $8 AND deleted = FALSE
     RETURNING *`,
    [name, description, priority, destinationAddress, latitude, longitude, packageId, userId]
  );
  return result.rows[0] || null;
}
