const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();
const Joi = require("joi");

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM sample_crud;",

    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(0),
    description: Joi.string().min(0),
    age: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const { name, description, age } = req.body;

  await pool.query(
    "INSERT INTO public.sample_crud(name, description, age) VALUES ($1, $2, $3);",
    [name, description, age],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully added!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/update/:id", async (req, res, next) => {
  const id = req.params.id;

  const schema = Joi.object({
    name: Joi.string().min(0),
    description: Joi.string().min(0),
    age: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const { name, description, age } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE public.sample_crud SET name=$1, description=$2, age=$3 WHERE id=$4;",
    [name, description, age, id],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully updated!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.delete("/delete/:id", async (req, res, next) => {
  const id = req.params.id;

  await pool.query(
    "DELETE FROM sample_crud WHERE id = $1",
    [id],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully Deleted" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
