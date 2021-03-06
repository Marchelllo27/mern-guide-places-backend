const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");
const { cors } = require("./middleware/cors");
require("dotenv").config();
// Routes imports
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(express.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use(cors);

// ROUTES
app.get("/", (req, res) => res.json({ message: "Welcome to API!" }));
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  return next(new HttpError("Could not find this route", 404));
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }

  console.log(error);

  // check if response was sent allready
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(process.env.DB_CREDENTIALS)
  .then(() => {
    const port = process.env.PORT || 4000;
    app.listen(port);
    console.log(`The server is runnig on the port ${port}`);
  })
  .catch(err => {
    console.log(err);
  });
