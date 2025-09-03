import { PASSWORD_GMAIL, USER_GMAIL } from "../config.js";
import nodemailer from "nodemailer";
import * as SupportDAO from "../dao/supportMessagesDAO.js";

export const createSupportMessage = async (req, res) => {
  try {
    const user_id = req.userId;
    const { category, message } = req.body;

    const supportMessage = await SupportDAO.createSupportMessageDAO(user_id, category, message);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: USER_GMAIL,
        pass: PASSWORD_GMAIL,
      },
    });

    const adminEmail = "debianmm2023@gmail.com";

    await transporter.sendMail({
      from: '"FastRoute Support" <debianmm2023@gmail.com>',
      to: adminEmail,
      subject: "📩 New Support Message Received",
      text: `📌 A user has submitted a new support message.\n\n🆔 User ID: ${user_id}\n📂 Category: ${category}\n✍️ Message: ${message}\n\n🔗 Check the admin panel to reply.`,
    });

    res.status(201).json(supportMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send support message." });
  }
};

export const adminGetAllSupportMessages = async (req, res) => {
  try {
    const messages = await SupportDAO.adminGetAllSupportMessagesDAO();
    res.json(messages);
  } catch (error) {
    console.error("Error retrieving support messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminGetSupportMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await SupportDAO.adminGetSupportMessageByIdDAO(id);

    if (!message) {
      return res.status(404).json({ message: "Support message not found" });
    }

    res.json(message);
  } catch (error) {
    console.error("Error retrieving support message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminUpdateSupportMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pendiente", "En proceso", "Resuelto"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedMessage = await SupportDAO.adminUpdateSupportMessageStatusDAO(id, status);

    if (!updatedMessage) {
      return res.status(404).json({ message: "Support message not found" });
    }

    res.json({ message: "Status updated successfully", updatedMessage });
  } catch (error) {
    console.error("Error updating support message status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminDeleteSupportMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SupportDAO.adminDeleteSupportMessageDAO(id);

    if (!deleted) {
      return res.status(404).json({ message: "Support message not found" });
    }

    res.json({ message: "Support message deleted successfully" });
  } catch (error) {
    console.error("Error deleting support message:", error);
    res.status(500).json({ message: "Server error" });
  }
};
