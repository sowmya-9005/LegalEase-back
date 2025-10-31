// routes/rights.js
const express = require("express");
const router = express.Router();
const Right = require("../models/Right"); // Mongoose model
const authMiddleware = require("../middleware/authMiddleware"); // your auth middleware

// ✅ Public GET - anyone can fetch rights
router.get("/", async (req, res) => {
  try {
    const rights = await Right.find();
    res.json(rights);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rights" });
  }
});

// ✅ POST - Add new right (protected)
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const newRight = await Right.create({ title, description, category });
    res.json(newRight);
  } catch (err) {
    res.status(500).json({ message: "Failed to add right" });
  }
});

// ✅ PUT - Update right (protected)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Right.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update right" });
  }
});

// ✅ DELETE - Delete right (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Right.findByIdAndDelete(req.params.id);
    res.json({ message: "Right deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete right" });
  }
});

module.exports = router;
