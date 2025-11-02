const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/authMiddleware");

// ✅ Public: Get all queries
router.get("/", async (req, res) => {
  try {
    const queries = await Contact.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error("GET /api/queries error:", err);
    res.status(500).json({ message: "Error fetching queries" });
  }
});

// ✅ Public: Submit a query
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, category, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "name, email and message required" });
    }

    const newQuery = new Contact({ name, email, phone, category, message });
    const saved = await newQuery.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /api/queries error:", err);
    res.status(500).json({ message: "Error submitting query" });
  }
});

// ✅ Logged-in: Add answer
router.post("/:id/answer", auth, async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer?.trim()) {
      return res.status(400).json({ message: "Answer is required" });
    }

    const query = await Contact.findById(req.params.id);
    if (!query) return res.status(404).json({ message: "Query not found" });

    const newAnswer = {
      answeredById: req.user._id,
      answeredByUsername: req.user.name,
      answeredByEmail: req.user.email,

      answer: answer.trim(),
      date: new Date()
    };

    query.answers.push(newAnswer);
    await query.save();

    res.json(query);
  } catch (err) {
    console.error("Error adding answer:", err);
    res.status(500).json({ message: "Error submitting answer" });
  }
});



// ✅ Logged-in: Edit answer
router.put("/:queryId/answer/:answerId", auth, async (req, res) => {
  try {
    const { queryId, answerId } = req.params;
    const query = await Contact.findById(queryId);
    if (!query) return res.status(404).json({ message: "Query not found" });

    const answer = query.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.answeredById.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You cannot edit this answer" });
    }

    answer.answer = req.body.answer.trim();
    answer.date = new Date();
    await query.save();

    res.json(query);
  } catch (err) {
    console.error("Error editing answer:", err);
    res.status(500).json({ message: "Failed to edit answer" });
  }
});

// ✅ Logged-in: Delete answer
router.delete("/:queryId/answer/:answerId", auth, async (req, res) => {
  try {
    const { queryId, answerId } = req.params;
    const query = await Contact.findById(queryId);
    if (!query) return res.status(404).json({ message: "Query not found" });

    const answer = query.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.answeredById.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You cannot delete this answer" });
    }

    answer.deleteOne();
    await query.save();

    res.json({ message: "Answer deleted", query });
  } catch (err) {
    console.error("Error deleting answer:", err);
    res.status(500).json({ message: "Failed to delete answer" });
  }
});

module.exports = router;
