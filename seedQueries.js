const mongoose = require("mongoose");
const Contact = require("./models/Contact");

mongoose.connect("mongodb://127.0.0.1:27017/legal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("Connected. Seeding data...");

  await Contact.deleteMany(); // Clear old data

  await Contact.insertMany([
    {
      name: "Rahul Verma",
      email: "rahul@example.com",
      phone: "9876543210",
      category: "Consumer Rights",
      message: "The product I ordered was defective but seller refuses refund.",
      answers: [
        { answeredBy: "Admin", answer: "You can file a case under Consumer Protection Act 2019." }
      ]
    },
    {
      name: "Priya Singh",
      email: "priya@gmail.com",
      phone: "9123456780",
      category: "Women & Child Rights",
      message: "What legal actions can be taken for workplace harassment?",
      answers: [
        { answeredBy: "Adv. Meera", answer: "You can file complaint under POSH Act, 2013." }
      ]
    }
  ]);

  console.log("✅ Static queries added");
  process.exit();
});
