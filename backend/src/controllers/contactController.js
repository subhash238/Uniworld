const prisma = require("../config/db");
const { sendContactNotification } = require("../utils/email");

const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const inquiry = await prisma.contactInquiry.create({
      data: { name, email, phone, subject, message },
    });

    let emailSent = false;
    try {
      emailSent = await sendContactNotification(inquiry);
    } catch (emailError) {
      console.error("Contact inquiry email notification failed:", emailError.message);
    }

    res.status(201).json({ message: "Inquiry submitted successfully", inquiry, emailSent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (unread === "true") where.isRead = false;

    const [inquiries, total] = await Promise.all([
      prisma.contactInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.contactInquiry.count({ where }),
    ]);

    res.json({
      inquiries,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await prisma.contactInquiry.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    await prisma.contactInquiry.delete({ where: { id: req.params.id } });
    res.json({ message: "Inquiry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createInquiry, getInquiries, markAsRead, deleteInquiry };
