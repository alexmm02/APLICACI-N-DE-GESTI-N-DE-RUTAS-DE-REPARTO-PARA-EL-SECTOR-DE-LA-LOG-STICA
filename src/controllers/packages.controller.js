import * as packagesDAO from "../dao/packagesDAO.js";
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "../config.js";

export const getAllPackages = async (req, res) => {
  try {
    const packages = await packagesDAO.getAllPackages(req.userId);
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Server error while fetching packages." });
  }
};

export const getPackage = async (req, res) => {
  try {
    const pkg = await packagesDAO.getPackageById(req.params.id, req.userId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found or access denied." });
    }
    res.json(pkg);
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ message: "Server error while fetching the package." });
  }
};

export const createPackage = async (req, res, next) => {
  const { name, description, priority, destinationAddress } = req.body;

  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationAddress)}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(geocodingUrl);

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;

      const pkg = await packagesDAO.createPackage({
        name,
        description,
        priority,
        destinationAddress,
        latitude: location.lat,
        longitude: location.lng,
        userId: req.userId,
      });

      res.json(pkg);
    } else {
      res.status(400).json({ message: "Unable to retrieve coordinates for the address." });
    }
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "A package with this name already exists." });
    }
    next(error);
  }
};

export const updatePackage = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, priority, destinationAddress } = req.body;

  try {
    const pkg = await packagesDAO.getPackageById(id, req.userId);
    if (!pkg) {
      return res.status(403).json({ message: "You do not have permission to modify this package." });
    }

    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationAddress)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(geocodingUrl);

    if (response.data.results?.length > 0) {
      const location = response.data.results[0].geometry.location;

      const updated = await packagesDAO.updatePackage({
        id,
        name,
        description,
        priority,
        destinationAddress,
        latitude: location.lat,
        longitude: location.lng,
      });

      res.json(updated);
    } else {
      res.status(400).json({ message: "Unable to retrieve coordinates for the address." });
    }
  } catch (error) {
    console.error("Error updating package:", error);
    next(error);
  }
};

export const deletePackage = async (req, res) => {
  const { id } = req.params;

  try {
    const pkg = await packagesDAO.getPackageById(id, req.userId);
    if (!pkg) {
      return res.status(403).json({ message: "You do not have permission to delete this package." });
    }

    await packagesDAO.deletePackage(id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Server error while deleting the package." });
  }
};

export const markPackageAsDelivered = async (req, res) => {
  const { id } = req.params;

  try {
    const pkg = await packagesDAO.getPackageById(id, req.userId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found or access denied." });
    }

    const updated = await packagesDAO.markPackageAsDelivered(id);
    res.json(updated);
  } catch (error) {
    console.error("❌ Error marking package as delivered:", error);
    res.status(500).json({ message: "Error updating the package." });
  }
};

export const unmarkPackageAsDelivered = async (req, res) => {
  const { id } = req.params;

  try {
    const pkg = await packagesDAO.getPackageById(id, req.userId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found or access denied." });
    }

    const updated = await packagesDAO.unmarkPackageAsDelivered(id);
    res.json(updated);
  } catch (error) {
    console.error("❌ Error unmarking package as delivered:", error);
    res.status(500).json({ message: "Error updating the package." });
  }
};


export const adminGetAllPackages = async (req, res) => {
  try {
    const packages = await packagesDAO.AdminGetAllPackages();
    res.json(packages);
  } catch (error) {
    console.error("Error fetching all packages:", error);
    res.status(500).json({ message: "Server error while fetching packages." });
  }
};

export const adminGetPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await packagesDAO.AdminGetPackageById(id);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found." });
    }

    res.json(pkg);
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ message: "Server error while fetching the package." });
  }
};

export const adminUpdatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, destinationAddress, priority, user_id } = req.body;

    if (!name || !destinationAddress || priority == null || !user_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationAddress)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(geocodeUrl);

    if (response.data.status !== "OK") {
      return res.status(400).json({ message: "Could not retrieve coordinates for the address." });
    }

    const { lat, lng } = response.data.results[0].geometry.location;

    const updated = await packagesDAO.AdminUpdatePackage({
      id,
      name,
      destinationAddress,
      priority,
      latitude: lat,
      longitude: lng,
      userId: user_id,
    });

    if (!updated) {
      return res.status(404).json({ message: "Package not found." });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ message: "Server error while updating the package." });
  }
};

export const adminDeletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await packagesDAO.AdminDeletePackage(id);

    if (!deleted) {
      return res.status(404).json({ message: "Package not found." });
    }

    res.json({ message: "Package deleted successfully." });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Server error while deleting the package." });
  }
};

export const adminCreatePackage = async (req, res) => {
  const { userId } = req.params;
  const { name, description, destinationAddress, priority } = req.body;

  if (!name || !destinationAddress || priority == null) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    destinationAddress
  )}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(geocodingUrl);

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;

      const pkg = await packagesDAO.AdminCreatePackage({
        name,
        description,
        priority,
        destinationAddress,
        latitude: location.lat,
        longitude: location.lng,
        userId,
      });

      res.status(201).json(pkg);
    } else {
      res.status(400).json({
        message: "Could not retrieve coordinates for the provided address.",
      });
    }
  } catch (error) {
    console.error("❌ Error creating package (admin):", error);
    res.status(500).json({ message: "Server error while creating the package." });
  }
};

export const adminGetUserPackages = async (req, res) => {
  const { userId } = req.params;

  try {
    const packages = await packagesDAO.AdminGetUserPackages(userId);
    res.json(packages);
  } catch (error) {
    console.error("Error fetching user's packages:", error);
    res.status(500).json({ message: "Server error while fetching user's packages." });
  }
};

// =======================
// === OWNER FUNCTIONS ===
// =======================


export const ownerGetCompanyUserPackages = async (req, res) => {
  const { userId } = req.params;
  const ownerId = req.userId;

  try {
    const companyId = await packagesDAO.OwnerGetUserCompanyId(userId);

    if (!companyId) {
      return res.status(404).json({ message: "User is not associated with any company" });
    }

    const isOwner = await packagesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to view this user's packages" });
    }

    const packages = await packagesDAO.OwnerGetPackagesByUserId(userId);
    res.json(packages);
  } catch (error) {
    console.error("❌ Error retrieving packages:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const ownerCreatePackageForUser = async (req, res) => {
  const { companyId, userId } = req.params;
  const { name, description, priority, destinationAddress } = req.body;
  const ownerId = req.userId;

  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationAddress)}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    console.log("🌐 Request to create package:", { companyId, userId, name, destinationAddress });

    const userCompanyId = await packagesDAO.OwnerGetUserCompanyId(userId);
    if (!userCompanyId) {
      return res.status(404).json({ message: "User does not exist or has no associated company" });
    }

    if (userCompanyId != companyId) {
      return res.status(400).json({ message: "User does not belong to this company" });
    }

    const isOwner = await packagesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to add packages to this user" });
    }

    console.log("📍 Fetching geolocation from Google Maps...");
    const geoRes = await axios.get(geocodingUrl);

    if (!geoRes.data.results || geoRes.data.results.length === 0) {
      console.log("❌ Empty geocoding response:", geoRes.data);
      return res.status(400).json({ message: "Could not retrieve coordinates for the provided address." });
    }

    const location = geoRes.data.results[0].geometry.location;
    const latitude = location.lat;
    const longitude = location.lng;

    console.log("📌 Coordinates obtained:", { latitude, longitude });

    const newPackage = await packagesDAO.OwnerInsertPackage({
      name,
      description,
      priority,
      destinationAddress,
      latitude,
      longitude,
      userId,
    });

    console.log("✅ Package inserted:", newPackage);
    res.status(201).json(newPackage);
  } catch (error) {
    console.error("❌ Error creating package:", error.message);
    if (error.response) {
      console.error("📥 Google API error:", error.response.data);
    }
    res.status(500).json({ message: "Error creating package", detail: error.message });
  }
};


export const ownerDeletePackageForUser = async (req, res) => {
  const { companyId, userId, packageId } = req.params;
  const ownerId = req.userId;

  try {
    const userCompanyId = await packagesDAO.OwnerGetUserCompanyId(userId);

    if (!userCompanyId || userCompanyId != companyId) {
      return res.status(400).json({ message: "User does not belong to this company" });
    }

    const isOwner = await packagesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to delete packages from this company" });
    }

    const deletedPackage = await packagesDAO.OwnerDeletePackageByUser(packageId, userId);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found or not authorized" });
    }

    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting package:", error.message);
    res.status(500).json({ message: "Error deleting package" });
  }
};


export const ownerUpdateEmployeePackage = async (req, res) => {
  const { companyId, userId, packageId } = req.params;
  const { name, description, priority, destinationAddress } = req.body;
  const ownerId = req.userId;

  try {
    const companyIdFromUser = await packagesDAO.OwnerGetUserCompanyId(userId);
    if (!companyIdFromUser || companyIdFromUser != companyId) {
      return res.status(400).json({ message: "User does not belong to this company" });
    }

    const isOwner = await packagesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to update this package" });
    }

    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationAddress)}&key=${GOOGLE_MAPS_API_KEY}`;
    const geoRes = await axios.get(geocodingUrl);

    if (!geoRes.data.results.length) {
      return res.status(400).json({ message: "Could not fetch coordinates" });
    }

    const location = geoRes.data.results[0].geometry.location;
    const latitude = location.lat;
    const longitude = location.lng;

    const updated = await packagesDAO.OwnerUpdatePackageByUser({
      packageId,
      userId,
      name,
      description,
      priority,
      destinationAddress,
      latitude,
      longitude,
    });

    if (!updated) {
      return res.status(404).json({ message: "Package not found or not authorized" });
    }

    res.json(updated);
  } catch (error) {
    console.error("❌ Error updating package:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const ownerGetPackageById = async (req, res) => {
  const { packageId, userId, companyId } = req.params;
  const ownerId = req.userId;

  try {
    const userCompanyId = await packagesDAO.OwnerGetUserCompanyId(userId);
    if (!userCompanyId || parseInt(userCompanyId) !== parseInt(companyId)) {
      return res.status(400).json({ message: "User does not belong to this company." });
    }

    const isOwner = await packagesDAO.OwnerCheckCompanyOwnership(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to view this package." });
    }

    const pkg = await packagesDAO.OwnerGetPackageById(packageId, userId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found or unauthorized." });
    }

    res.json(pkg);
  } catch (error) {
    console.error("❌ Error retrieving package:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
