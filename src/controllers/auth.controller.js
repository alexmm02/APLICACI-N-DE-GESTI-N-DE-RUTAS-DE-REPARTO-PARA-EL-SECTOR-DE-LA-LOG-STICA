import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { PASSWORD_GMAIL, USER_GMAIL } from "../config.js";

import * as authDAO from "../dao/authDAO.js"; 

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authDAO.getUserByEmail(email);

    if (!user) {
      const userDeleted = await authDAO.getUserIfExists(email);

      if (userDeleted && userDeleted.deleted) {
        return res.status(403).json({
          message:
            "This account has been deactivated. Contact support if you wish to restore it.",
        });
      }

      return res.status(400).json({ message: "Email is not registered" });
    }

    if (!user.is_verified) {
      return res.status(401).json({
        message: "You must verify your email before signing in.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const payload = { id: user.id, role: user.role }; 
    const token = await createAccessToken(payload);

    console.log("Token : ", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.json(user);
  } catch (error) {
    console.error("Error in signin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const signup = async (req, res, next) => {
  const { name, email, password, companyCode } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const role = "user";

    let companyId = null;

    if (companyCode) {
      const company = await authDAO.getCompanyByJoinCode(companyCode);

      if (!company) {
        return res.status(400).json({ message: "Invalid company code" });
      }

      companyId = company.id;
    }

    const user = await authDAO.createUser({
      name,
      email,
      hashedPassword,
      verificationToken,
      role,
      companyId,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: USER_GMAIL,
        pass: PASSWORD_GMAIL,
      },
    });

    const verificationLink = `http://localhost:5173/verify/${verificationToken}`;

    await transporter.sendMail({
      from: '"FastRoute" <debianmm2023@gmail.com>',
      to: email,
      subject: "Verify your account on FastRoute",
      text: `Welcome to FastRoute! To activate your account, click the following link: ${verificationLink}`,
    });

    return res.status(201).json({
      message: "User registered. Check your email to verify your account.",
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Email is already registered" });
    }

    next(error);
  }
};



export const signout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",  
  });

  res.sendStatus(200);
};


export const profile = async (req, res) => {
  try {
    const user = await authDAO.getUserById(req.userId);
    return res.json(user);
  } catch (error) {
    console.error("Error in profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId;

  try {
    const user = await authDAO.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await authDAO.updatePassword(userId, hashedPassword);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await authDAO.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "No account found with that email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 3600000); 

    await authDAO.setResetToken(email, resetToken, expiration);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: USER_GMAIL,
        pass: PASSWORD_GMAIL,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: '"FastRoute" <debianmm2023@gmail.com>',
      to: email,
      subject: "Password Recovery",
      text: `To reset your password, click the following link: ${resetLink}`,
    });

    res.json({ message: "Recovery email sent" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await authDAO.getUserByResetToken(token);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await authDAO.resetUserPassword(user.id, hashedPassword);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateProfile = async (req, res) => {
  const { name, companyCode } = req.body;
  const userId = req.userId;

  try {
    const user = await authDAO.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let companyId = null;
    if (companyCode) {
      const company = await authDAO.getCompanyByJoinCode(companyCode);

      if (!company) {
        return res.status(400).json({ message: "Invalid company code" });
      }

      companyId = company.id;
    }

    const updatedUser = await authDAO.updateProfile(userId, name, companyId);

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await authDAO.getUserByVerificationToken(token);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    await authDAO.verifyUserEmail(user.id);

    res.json({ message: "Email verified successfully. You can now sign in." });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const leaveCompany = async (req, res) => {
  const userId = req.userId;

  try {
    await authDAO.leaveCompany(userId);
    res.json({ message: "You have successfully left the company" });
  } catch (error) {
    console.error("Error in leaveCompany:", error);
    res.status(500).json({ message: "Error while leaving the company" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId; 

    const deleted = await authDAO.deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found or already deleted" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const adminGetAllUsers = async (req, res) => {
  try {
    const users = await authDAO.AdminGetAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "An error occurred while fetching users." });
  }
};

export const adminGetUserById = async (req, res) => {
  try {
    const user = await authDAO.AdminGetUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "An error occurred while fetching the user." });
  }
};

export const adminUpdateUser = async (req, res) => {
  const { name, role, is_verified } = req.body;
  try {
    const user = await authDAO.AdminUpdateUser(req.params.id, name, role, is_verified);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "An error occurred while updating the user." });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const user = await authDAO.AdminDeleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "An error occurred while deleting the user." });
  }
};

