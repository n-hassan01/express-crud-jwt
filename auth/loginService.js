const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../dbConnection");
const Joi = require("joi");

const router = express.Router();

router.post("/", (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const { username, password } = req.body;

  pool.query(
    'SELECT * FROM "user" WHERE user_name=$1',
    [username],
    async (error, result) => {
      try {
        if (error) throw error;

        const status = result.rows[0].activate;
        if (result.rowCount > 0 && status === "Y") {
          const isValidPassword = await bcrypt.compare(
            password,
            result.rows[0].password
          );
          if (isValidPassword) {
            const token = jwt.sign(
              {
                id: result.rows[0].user_id,
                username: result.rows[0].user_name,
              },
              process.env.SECRET_KEY,
              {
                expiresIn: "30d",
              }
            );

            res.status(200).json({
              value: token,
              message: "Login successful",
            });
          } else {
            next({ message: "Authentication failed!" });
          }
        } else {
          next({ message: "Sorry! You are not authorized" });
        }
      } catch (err) {
        console.log(err.message);

        next({ message: "Authentication failed!" });
      }
    }
  );
});

module.exports = router;
