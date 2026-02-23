const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/TutorTrackDB";

const connectDB = async () => {
  try {
    // Mongoose 6+ uses new URL parser and unified topology by default - no options needed
    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB Connected successfully");
    console.log("📊 Database:", mongoose.connection.name);
    console.log("🔌 Host:", mongoose.connection.host);
    console.log("🔌 Port:", mongoose.connection.port);

    mongoose.connection.on("connected", () => {
      console.log("✅ Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Mongoose disconnected from MongoDB");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
