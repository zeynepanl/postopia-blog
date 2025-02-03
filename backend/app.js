require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(cors());

// API Route'ları
app.use("/api", routes);
app.use(express.urlencoded({ extended: true })); 

// Hata Yönetimi
app.use((req, res, next) => {
  res.status(404).json({ error: "Route Not Found" });
});

module.exports = app;
