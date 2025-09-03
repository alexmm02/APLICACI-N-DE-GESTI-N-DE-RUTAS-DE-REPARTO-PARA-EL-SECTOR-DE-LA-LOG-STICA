import * as routesDAO from "../dao/routesDAO.js";

export const createRoute = async (req, res) => {
  try {
    const { name, packageIds } = req.body;
    const userId = req.userId;

    if (!name || !packageIds || packageIds.length === 0) {
      return res.status(400).json({ message: "Name and packages are required" });
    }

    const route = await routesDAO.createRoute({ name, userId, packageIds });
    res.status(201).json({ message: "Route created successfully", routeId: route.id });
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserRoutes = async (req, res) => {
  try {
    const routes = await routesDAO.getUserRoutes(req.userId);
    res.json(routes);
  } catch (error) {
    console.error("Error retrieving user routes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRoutePackages = async (req, res) => {
  try {
    const { id } = req.params;
    const packages = await routesDAO.getRoutePackages(id, req.userId);
    res.json(packages);
  } catch (error) {
    console.error("Error retrieving route packages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRouteName = async (req, res) => {
  try {
    const { id } = req.params;
    const name = await routesDAO.getRouteName(id, req.userId);
    if (!name) return res.status(404).json({ message: "Route not found or access denied" });
    res.json(name);
  } catch (error) {
    console.error("Error retrieving route name:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRouteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await routesDAO.updateRouteStatus(id, status, req.userId);
    if (!result) return res.status(404).json({ message: "Route not found or access denied" });
    res.json({ message: "Route status updated successfully" });
  } catch (error) {
    console.error("Error updating route status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await routesDAO.deleteRoute(id, req.userId);
    if (!deleted) return res.status(404).json({ message: "Route not found or no permission" });
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await routesDAO.getRouteById(id, req.userId);
    if (!route) return res.status(404).json({ message: "Route not found or no access" });
    res.json(route);
  } catch (error) {
    console.error("Error retrieving route:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, packageIds } = req.body;
    const updated = await routesDAO.updateRoute({ id, name, packageIds, userId: req.userId });
    if (!updated) return res.status(404).json({ message: "Route not found or no access" });
    res.json({ message: "Route updated successfully" });
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========== ADMIN FUNCTIONS ==========

export const adminGetAllRoutes = async (req, res) => {
  try {
    const routes = await routesDAO.adminGetAllRoutes();
    res.json(routes);
  } catch (error) {
    console.error("Error retrieving all routes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminGetRouteById = async (req, res) => {
  try {
    const route = await routesDAO.adminGetRouteById(req.params.id);
    if (!route) return res.status(404).json({ message: "Route not found" });
    res.json(route);
  } catch (error) {
    console.error("Error retrieving route:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminUpdateRouteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await routesDAO.adminUpdateRouteStatus(id, status);
    if (!updated) return res.status(404).json({ message: "Route not found" });
    res.json({ message: "Route status updated successfully" });
  } catch (error) {
    console.error("Error updating route status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminDeleteRoute = async (req, res) => {
  try {
    const deleted = await routesDAO.adminDeleteRoute(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Route not found" });
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminGetRoutePackages = async (req, res) => {
  try {
    const packages = await routesDAO.adminGetRoutePackages(req.params.id);
    res.json(packages);
  } catch (error) {
    console.error("Error retrieving route packages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminGetUserRoutes = async (req, res) => {
  try {
    const routes = await routesDAO.adminGetUserRoutes(req.params.userId);
    res.json(routes);
  } catch (error) {
    console.error("Error retrieving user routes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminUpdateRoute = async (req, res) => {
  try {
    const updated = await routesDAO.adminUpdateRoute({ ...req.body, id: req.params.id });
    if (!updated) return res.status(404).json({ message: "Route not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminCreateRoute = async (req, res) => {
  try {
    const route = await routesDAO.adminCreateRoute({ userId: req.params.userId, ...req.body });
    res.status(201).json(route);
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ message: "Failed to create route" });
  }
};


export const ownerGetCompanyUserRoutes = async (req, res) => {
  const { userId } = req.params;
  const ownerId = req.userId;

  try {
    const companyId = await routesDAO.OwnerGetUserCompanyId(userId);

    if (!companyId) {
      return res.status(404).json({ message: "User is not associated with any company." });
    }

    const isOwner = await routesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to view this user's routes." });
    }

    const routes = await routesDAO.OwnerGetRoutesByUserId(userId);
    res.json(routes);
  } catch (error) {
    console.error("❌ Error retrieving routes:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const ownerGetRouteById = async (req, res) => {
  const { routeId, userId, companyId } = req.params;
  const ownerId = req.userId;

  try {
    const userCompanyId = await routesDAO.OwnerGetUserCompanyId(userId);
    if (!userCompanyId || parseInt(userCompanyId) !== parseInt(companyId)) {
      return res.status(400).json({ message: "User does not belong to this company." });
    }

    const isOwner = await routesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to view this route." });
    }

    const route = await routesDAO.OwnerGetRouteById(routeId, userId);
    if (!route) {
      return res.status(404).json({ message: "Route not found or not authorized." });
    }

    res.json(route);
  } catch (error) {
    console.error("❌ Error retrieving route:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const ownerCreateRouteForUser = async (req, res) => {
  const { companyId, userId } = req.params;
  const { name, packageIds } = req.body;
  const ownerId = req.userId;

  try {
    const userCompanyId = await routesDAO.OwnerGetUserCompanyId(userId);
    if (!userCompanyId || userCompanyId != companyId) {
      return res.status(400).json({ message: "The user does not belong to this company." });
    }

    const isOwner = await routesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to create routes for this user." });
    }

    const route = await routesDAO.OwnerInsertRoute(userId, name);

    if (packageIds?.length > 0) {
      await routesDAO.OwnerAssignPackagesToRoute(route.id, packageIds);
    }

    res.status(201).json(route);
  } catch (error) {
    console.error("❌ Error creating route:", error.message || error);
    res.status(500).json({ message: "Error creating route." });
  }
};

export const ownerDeleteRouteForUser = async (req, res) => {
  const { companyId, userId, routeId } = req.params;
  const ownerId = req.userId;

  try {
    const userCompanyId = await routesDAO.OwnerGetUserCompanyId(userId);
    if (!userCompanyId || userCompanyId != companyId) {
      return res.status(400).json({ message: "The user does not belong to this company." });
    }

    const isOwner = await routesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to delete routes from this company." });
    }

    const deleted = await routesDAO.OwnerDeleteRouteByUser(routeId, userId);
    if (!deleted) {
      return res.status(404).json({ message: "Route not found or not authorized." });
    }

    res.json({ message: "Route successfully deleted." });
  } catch (error) {
    console.error("❌ Error deleting route:", error.message);
    res.status(500).json({ message: "Internal server error while deleting route." });
  }
};


export const ownerUpdateRouteForUser = async (req, res) => {
  const { companyId, userId, routeId } = req.params;
  const { name, status, packageIds } = req.body;
  const ownerId = req.userId;

  try {
    const route = await routesDAO.OwnerGetRouteByUser(routeId, userId);
    if (!route) {
      return res.status(404).json({ message: "Route not found for this user" });
    }

    const companyIdFromUser = await routesDAO.OwnerGetUserCompanyId(userId);
    if (!companyIdFromUser || companyIdFromUser != companyId) {
      return res.status(400).json({ message: "User does not belong to this company" });
    }

    const isOwner = await routesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You do not have permission to edit this route" });
    }

    const updatedRoute = await routesDAO.OwnerUpdateRouteNameAndStatus(routeId, name, status);
    await routesDAO.OwnerClearRoutePackages(routeId);

    if (packageIds?.length > 0) {
      await routesDAO.OwnerAssignPackagesToRoute(routeId, packageIds);
    }

    res.json(updatedRoute);
  } catch (error) {
    console.error("❌ Error updating route:", error.message);
    res.status(500).json({ message: "Internal server error while updating the route." });
  }
};


export const ownerGetRoutePackages = async (req, res) => {
  const { companyId, userId, routeId } = req.params;
  const ownerId = req.userId;

  try {
    const userCompanyId = await routesDAO.OwnerGetUserCompanyId(userId);
    if (!userCompanyId || parseInt(userCompanyId) !== parseInt(companyId)) {
      return res.status(400).json({ message: "User does not belong to this company." });
    }

    const isOwner = await routesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "Not authorized to view route packages." });
    }

    const route = await routesDAO.OwnerGetRouteByUser(routeId, userId);
    if (!route) {
      return res.status(404).json({ message: "Route not found for this user." });
    }

    const packages = await routesDAO.getRoutePackages(routeId, userId);
    res.json(packages);
  } catch (error) {
    console.error("❌ Error retrieving route packages:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
