// routesDAO.js

import { pool } from "../db.js";

// =====================
// === USER FUNCTIONS ===
// =====================

export async function createRoute({ name, userId, packageIds }) {
  const routeResult = await pool.query(
    "INSERT INTO routes (name, user_id) VALUES ($1, $2) RETURNING id",
    [name, userId]
  );
  const routeId = routeResult.rows[0].id;

  for (const packageId of packageIds) {
    await pool.query(
      "INSERT INTO route_packages (route_id, package_id) VALUES ($1, $2)",
      [routeId, packageId]
    );
  }

  return routeId;
}

export async function getUserRoutes(userId) {
  const result = await pool.query(
    "SELECT * FROM routes WHERE user_id = $1 AND deleted = FALSE ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

export async function getRoutePackages(id, userId) {
  const result = await pool.query(
    `SELECT p.* FROM packages p
     JOIN route_packages rp ON p.id = rp.package_id
     JOIN routes r ON r.id = rp.route_id
     WHERE rp.route_id = $1 AND r.user_id = $2
     AND r.deleted = FALSE AND p.deleted = FALSE`,
    [id, userId]
  );
  return result.rows;
}

export async function getRouteName(id, userId) {
  const result = await pool.query(
    "SELECT name FROM routes WHERE id = $1 AND user_id = $2 AND deleted = FALSE",
    [id, userId]
  );
  return result.rows[0];
}

export async function updateRouteStatus(id, status, userId) {
  const result = await pool.query(
    "UPDATE routes SET status = $1 WHERE id = $2 AND user_id = $3 AND deleted = FALSE RETURNING *",
    [status, id, userId]
  );
  return result.rows[0];
}

export async function deleteRoute(id, userId) {
  await pool.query("DELETE FROM route_packages WHERE route_id = $1", [id]);
  const result = await pool.query(
    "UPDATE routes SET deleted = TRUE WHERE id = $1 AND user_id = $2 AND deleted = FALSE RETURNING *",
    [id, userId]
  );
  return result.rows[0];
}

export async function getRouteById(id, userId) {
  const routeRes = await pool.query(
    "SELECT * FROM routes WHERE id = $1 AND user_id = $2 AND deleted = FALSE",
    [id, userId]
  );

  if (routeRes.rowCount === 0) return null;

  const packagesRes = await pool.query(
    `SELECT p.id, p.name, p.destinationaddress 
     FROM packages p
     JOIN route_packages rp ON p.id = rp.package_id
     WHERE rp.route_id = $1 AND p.deleted = FALSE`,
    [id]
  );

  return {
    ...routeRes.rows[0],
    packages: packagesRes.rows,
  };
}

export async function updateRoute({ id, name, packageIds, userId }) {
  const { rowCount } = await pool.query(
    `UPDATE routes SET name = $1 WHERE id = $2 AND user_id = $3 AND deleted = FALSE`,
    [name, id, userId]
  );
  if (rowCount === 0) return false;

  await pool.query("DELETE FROM route_packages WHERE route_id = $1", [id]);

  for (const packageId of packageIds) {
    await pool.query(
      "INSERT INTO route_packages (route_id, package_id) VALUES ($1, $2)",
      [id, packageId]
    );
  }

  return true;
}

// ======================
// === ADMIN FUNCTIONS ===
// ======================

export async function adminGetAllRoutes() {
  const result = await pool.query(
    `SELECT r.id, r.name, r.status, r.created_at, u.name AS user_name, u.email
     FROM routes r
     JOIN users u ON r.user_id = u.id
     WHERE r.deleted = FALSE
     ORDER BY r.created_at DESC`
  );
  return result.rows;
}

export async function adminGetRouteById(id) {
  const result = await pool.query(
    `SELECT r.*, u.name AS user_name, u.email 
     FROM routes r
     JOIN users u ON r.user_id = u.id
     WHERE r.id = $1 AND r.deleted = FALSE`,
    [id]
  );
  return result.rows[0];
}

export async function adminUpdateRouteStatus(id, status) {
  const result = await pool.query(
    "UPDATE routes SET status = $1 WHERE id = $2 AND deleted = FALSE RETURNING *",
    [status, id]
  );
  return result.rows[0];
}

export async function adminDeleteRoute(id) {
  const result = await pool.query(
    `UPDATE routes SET deleted = TRUE WHERE id = $1 AND deleted = FALSE RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function adminGetRoutePackages(id) {
  const result = await pool.query(
    `SELECT p.* FROM packages p
     JOIN route_packages rp ON p.id = rp.package_id
     WHERE rp.route_id = $1 AND p.deleted = FALSE`,
    [id]
  );
  return result.rows;
}

export async function adminGetUserRoutes(userId) {
  const result = await pool.query("SELECT * FROM routes WHERE user_id = $1 AND deleted = FALSE", [userId]);
  return result.rows;
}

export async function adminUpdateRoute({ id, name, status, packageIds }) {
  await pool.query("UPDATE routes SET name = $1, status = $2 WHERE id = $3 AND deleted = FALSE", [name, status, id]);
  await pool.query("DELETE FROM route_packages WHERE route_id = $1", [id]);

  for (const packageId of packageIds) {
    await pool.query(
      "INSERT INTO route_packages (route_id, package_id) VALUES ($1, $2)",
      [id, packageId]
    );
  }

  return true;
}

export async function adminCreateRoute({ userId, name, status = "pendiente", packageIds = [] }) {
  const routeRes = await pool.query(
    "INSERT INTO routes (user_id, name, status) VALUES ($1, $2, $3) RETURNING *",
    [userId, name, status]
  );
  const routeId = routeRes.rows[0].id;

  for (const packageId of packageIds) {
    await pool.query(
      "INSERT INTO route_packages (route_id, package_id) VALUES ($1, $2)",
      [routeId, packageId]
    );
  }

  return routeRes.rows[0];
}


// =======================
// === OWNER FUNCTIONS ===
// =======================

export async function OwnerGetUserCompanyId(userId) {
  const result = await pool.query("SELECT company_id FROM users WHERE id = $1", [userId]);
  return result.rows[0]?.company_id || null;
}

export async function OwnerCheckCompanyOwnership(companyId, ownerId) {
  const result = await pool.query(
    "SELECT * FROM companies WHERE id = $1 AND created_by = $2",
    [companyId, ownerId]
  );
  return result.rowCount > 0;
}

export async function OwnerGetRoutesByUserId(userId) {
  const result = await pool.query("SELECT * FROM routes WHERE user_id = $1", [userId]);
  return result.rows;
}

export async function OwnerInsertRoute(userId, name) {
  const result = await pool.query(
    "INSERT INTO routes (user_id, name) VALUES ($1, $2) RETURNING *",
    [userId, name]
  );
  return result.rows[0];
}

export async function OwnerAssignPackagesToRoute(routeId, packageIds) {
  for (const packageId of packageIds) {
    await pool.query(
      "INSERT INTO route_packages (route_id, package_id) VALUES ($1, $2)",
      [routeId, packageId]
    );
  }
}

export async function OwnerDeleteRouteByUser(routeId, userId) {
  const result = await pool.query(
    "DELETE FROM routes WHERE id = $1 AND user_id = $2 RETURNING *",
    [routeId, userId]
  );
  return result.rows[0] || null;
}

export async function OwnerUpdateRouteNameAndStatus(routeId, name, status) {
  const result = await pool.query(
    `UPDATE routes SET name = $1, status = $2 WHERE id = $3 RETURNING *`,
    [name, status, routeId]
  );
  return result.rows[0];
}

export async function OwnerClearRoutePackages(routeId) {
  await pool.query("DELETE FROM route_packages WHERE route_id = $1", [routeId]);
}

export async function OwnerGetRouteByUser(routeId, userId) {
  const result = await pool.query(
    "SELECT * FROM routes WHERE id = $1 AND user_id = $2",
    [routeId, userId]
  );
  return result.rows[0];
}

export async function OwnerGetRouteById(routeId, userId) {
  const result = await pool.query(
    "SELECT * FROM routes WHERE id = $1 AND user_id = $2",
    [routeId, userId]
  );
  return result.rows[0];
}
