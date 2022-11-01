const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

require("./auth/auth");
const authRoute = require("./routes/auth");

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection is successful.");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running.");
});
