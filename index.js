require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing for api services and middlewares
// api services
const sampleCrudService = require("./controllers/sampleCrud");
const loginService = require("./auth/loginService");

// middlewares
const authGuard = require("./middlewares/authGuard");

// auth
app.use("/login", loginService);

// api services
// sample crud
app.use("/sample-crud", authGuard, sampleCrudService);

// error handling middleware
app.use((req, res, next) => {
  next("Requested url not found!");
});

app.use((err, req, res, next) => {
  console.log(err);

  if (err.message) {
    res.status(500).send(err.message);
  } else {
    res.status(500).send("Internal Server Error");
  }
});

// environment variable
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
