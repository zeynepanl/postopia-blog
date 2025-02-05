require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const routes = require("./routes");
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Route'ları
app.use("/api", routes);

// Hata Yönetimi
app.use((req, res, next) => {
  res.status(404).json({ error: "Route Not Found" });
});

// Statik dosya servisini ayarla

module.exports = app;
