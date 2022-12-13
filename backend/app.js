const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

const password = "SWLs5mITxW3XxykN";

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

app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;
