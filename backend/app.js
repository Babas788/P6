const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");
const password = process.env.S3_BUCKET;

mongoose
  .connect(
    `mongodb+srv://Babas788:${password}@cluster0.q9kjugb.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;
