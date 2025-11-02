const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  answeredById: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answeredByUsername: { type: String, required: true },
  answeredByEmail: { type: String, required: true },
  
  answer: { type: String, required: true },
  date: { type: Date, default: Date.now }
});


const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    category: String,
    message: String,
    answers: [answerSchema]   // ✅ Updated subdocument structure
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
