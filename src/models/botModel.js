const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema({
  userId: {
    type: String, // storing ID as plain string
    required: true
  },
  username: {
    type: String,
    required: true
  },
});
const chatbotModel = mongoose.model("Chatbot", chatbotSchema);
module.exports = chatbotModel
