import { pool } from "../db.js";
import { nanoid } from "nanoid";
import * as companiesDAO from "../dao/companiesDAO.js";

export const createCompany = async (req, res) => {
  const { name } = req.body;
  const createdBy = req.userId;

  if (!name) {
    return res.status(400).json({ message: "Company name is required" });
  }

  const joinCode = nanoid(8);

  try {
    const company = await companiesDAO.createCompany({
      name,
      createdBy,
      joinCode,
    });

    return res.status(201).json({ company });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Company name or join code already in use" });
    }
    console.error("❌ Error creating company:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getCompanyById = async (req, res) => {
  const { id } = req.params;

  try {
    const company = await companiesDAO.getCompanyById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    res.json(company);
  } catch (error) {
    console.error("❌ Error retrieving company:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};



export const getMyCompanies = async (req, res) => {
  const ownerId = req.userId;

  try {
    const companies = await companiesDAO.getCompaniesByOwner(ownerId);
    res.json(companies);
  } catch (error) {
    console.error("❌ Error retrieving companies:", error);
    res.status(500).json({ message: "Internal server error while retrieving companies" });
  }
};


export const getCompanyEmployees = async (req, res) => {
  const { companyId } = req.params;
  const ownerId = req.userId;

  try {
    const isOwner = await companiesDAO.verifyCompanyOwnership(companyId, ownerId);

    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to view this company's employees" });
    }

    const employees = await companiesDAO.getEmployeesByCompanyId(companyId);
    res.json(employees);
  } catch (error) {
    console.error("❌ Error retrieving employees:", error.message);
    res.status(500).json({ message: "Internal server error while retrieving employees" });
  }
};

export const deleteOwnCompanyById = async (req, res) => {
  const { id: companyId } = req.params;
  const userId = req.userId;

  try {
    const isOwner = await companiesDAO.verifyCompanyOwnership(companyId, userId);

    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to delete this company or it doesn't exist." });
    }

    await companiesDAO.removeEmployeesFromCompany(companyId);
    const deletedCompany = await companiesDAO.deleteCompanyById(companyId);

    res.json({ message: "Company successfully deleted", company: deletedCompany });
  } catch (error) {
    console.error("❌ Error deleting company:", error.message);
    res.status(500).json({ message: "Internal server error while deleting company" });
  }
};

export const removeEmployeeFromCompany = async (req, res) => {
  const { companyId, userId } = req.params;
  const ownerId = req.userId;

  try {
    const isOwner = await companiesDAO.isCompanyOwnedByUser(companyId, ownerId);
    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to modify this company." });
    }

    const isInCompany = await companiesDAO.isUserInCompany(userId, companyId);
    if (!isInCompany) {
      return res.status(404).json({ message: "User does not belong to this company." });
    }

    if (parseInt(userId) === ownerId) {
      return res.status(400).json({ message: "You cannot remove yourself from your own company." });
    }

    await companiesDAO.removeUserFromCompany(userId);
    res.json({ message: "Employee successfully removed from the company." });
  } catch (error) {
    console.error("❌ Error removing employee:", error.message || error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getEmployeeById = async (req, res) => {
  const { companyId, userId } = req.params;
  const ownerId = req.userId;

  try {
    const isOwner = await companiesDAO.verifyCompanyOwnership(companyId, ownerId);

    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to view this employee" });
    }

    const employee = await companiesDAO.getUserInCompany(userId, companyId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found in this company" });
    }

    res.json(employee);
  } catch (error) {
    console.error("❌ Error retrieving employee by ID:", error.message || error);
    res.status(500).json({ message: "Internal server error while retrieving employee" });
  }
};


export const adminGetAllCompanies = async (req, res) => {
  try {
    const companies = await companiesDAO.AdminGetAllCompanies();
    res.json(companies);
  } catch (error) {
    console.error("❌ Error retrieving companies:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const adminGetEmployeesByCompanyId = async (req, res) => {
  const { id: companyId } = req.params;

  try {
    const employees = await companiesDAO.AdminGetEmployeesByCompanyId(companyId);
    res.json(employees);
  } catch (error) {
    console.error("❌ Error retrieving employees:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const adminDeleteCompanyById = async (req, res) => {
  const { id: companyId } = req.params;

  try {
    const deleted = await companiesDAO.AdminDeleteCompanyById(companyId);

    if (!deleted) {
      return res.status(404).json({ message: "Company not found." });
    }

    res.json({ message: "Company deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting company:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const adminRemoveEmployeeFromCompany = async (req, res) => {
  const { companyId, userId } = req.params;
  const requesterId = req.userId;

  try {
    const employee = await companiesDAO.adminGetUserInCompany(userId, companyId);

    if (!employee) {
      return res.status(404).json({ message: "User does not belong to this company." });
    }

    if (parseInt(userId) === requesterId) {
      return res.status(400).json({ message: "You cannot remove yourself." });
    }

    await companiesDAO.adminRemoveUserFromCompany(userId);

    res.json({ message: "User successfully removed from the company." });
  } catch (error) {
    console.error("❌ Error removing employee:", error.message || error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const adminGetCompanyById = async (req, res) => {
  try {
    const company = await companiesDAO.AdminGetCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    res.json(company);
  } catch (error) {
    console.error("❌ Error retrieving company:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};










