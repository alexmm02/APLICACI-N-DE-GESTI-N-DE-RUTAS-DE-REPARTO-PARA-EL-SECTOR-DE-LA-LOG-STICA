import { pool } from "../db.js";
import * as timeDAO from "../dao/timeDAO.js";

export const clockIn = async (req, res) => {
  const userId = req.userId;

  try {
    const companyId = await timeDAO.getUserCompanyId(userId);
    if (!companyId) {
      return res.status(400).json({ message: "You are not part of any company." });
    }

    const alreadyClockedIn = await timeDAO.hasOpenClockIn(userId);
    if (alreadyClockedIn) {
      return res.status(400).json({ message: "You already have an active clock-in." });
    }

    const entry = await timeDAO.clockIn(userId, companyId);
    res.status(201).json(entry);
  } catch (error) {
    console.error("❌ Error during clock-in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const clockOut = async (req, res) => {
  const userId = req.userId;

  try {
    const openEntry = await timeDAO.getOpenClockEntry(userId);
    if (!openEntry) {
      return res.status(400).json({ message: "No active clock-in found." });
    }

    const closedEntry = await timeDAO.clockOut(openEntry.id);
    res.json(closedEntry);
  } catch (error) {
    console.error("❌ Error during clock-out:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getTodayEntry = async (req, res) => {
  const userId = req.userId;

  try {
    const entry = await timeDAO.getTodayEntry(userId);
    if (!entry) {
      return res.status(404).json({ message: "No clock-in found for today." });
    }

    res.json(entry);
  } catch (error) {
    console.error("❌ Error retrieving today's entry:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const getMonthlyEntries = async (req, res) => {
  const userId = req.userId;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  try {
    const entries = await timeDAO.getMonthlyEntries(userId, month, year);
    res.json(entries);
  } catch (error) {
    console.error("❌ Error retrieving monthly entries:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const ownerGetUserMonthlyEntries = async (req, res) => {
  const ownerId = req.userId;
  const { userId } = req.params;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  try {
    const companyId = await timeDAO.OwnerGetUserCompanyId(userId);

    if (!companyId) {
      return res.status(404).json({ message: "User is not associated with any company." });
    }

    const isOwner = await timeDAO.OwnerCheckCompanyOwnership(companyId, ownerId);

    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to view this user's entries." });
    }

    const entries = await timeDAO.OwnerGetUserMonthlyEntries(userId, month, year);
    res.json(entries);
  } catch (error) {
    console.error("❌ Error retrieving user's monthly entries:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const adminGetUserMonthlyEntries = async (req, res) => {
  const { userId } = req.params;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  try {
    const entries = await timeDAO.AdminGetUserMonthlyEntries(userId, month, year);
    res.json(entries);
  } catch (err) {
    console.error("❌ Error retrieving user's monthly entries (admin):", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
