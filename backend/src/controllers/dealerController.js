const prisma = require("../config/db");

const createDealer = async (req, res) => {
  try {
    const { name, company, email, phone, address, city, state, isActive } = req.body;

    const dealer = await prisma.dealer.create({
      data: { name, company, email, phone, address, city, state, isActive: isActive !== "false" },
    });

    res.status(201).json({ message: "Dealer created", dealer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDealers = async (req, res) => {
  try {
    const dealers = await prisma.dealer.findMany({ orderBy: { createdAt: "desc" } });
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getActiveDealers = async (req, res) => {
  try {
    const dealers = await prisma.dealer.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateDealer = async (req, res) => {
  try {
    const { name, company, email, phone, address, city, state, isActive } = req.body;
    const data = {};

    if (name) data.name = name;
    if (company !== undefined) data.company = company;
    if (email !== undefined) data.email = email;
    if (phone) data.phone = phone;
    if (address !== undefined) data.address = address;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (isActive !== undefined) data.isActive = isActive !== "false";

    const dealer = await prisma.dealer.update({ where: { id: req.params.id }, data });
    res.json({ message: "Dealer updated", dealer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteDealer = async (req, res) => {
  try {
    await prisma.dealer.delete({ where: { id: req.params.id } });
    res.json({ message: "Dealer deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createDealer, getDealers, getActiveDealers, updateDealer, deleteDealer };
