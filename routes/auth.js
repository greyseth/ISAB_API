const pg = require("pg");

const express = require("express");
const requireParams = require("../middlewares/requireParams");
const requireParamsAfter = require("../middlewares/requireParamsAfter");
const client = require("../utils/db");
const { encryptPassword, comparePassword } = require("../utils/encrypt");
const generateToken = require("../utils/generateToken");
const handleError = require("../utils/handleError");
const router = express.Router();

router.post("/register", requireParams(["role"]), (req, res) => {
  if (req.body.role === "student")
    // Register student user
    requireParamsAfter(req, res, ["nim", "password"], async () => {
      // In final version, replace register for student role with connecting to campus database

      // create temporary campus db connection
      const campusClient = new pg.Client({
        user: process.env.CAMPUS_DB_USER,
        password: process.env.CAMPUS_DB_PASSWORD ?? "",
        host: process.env.CAMPUS_DB_HOST,
        port: process.env.CAMPUS_DB_PORT,
        database: process.env.CAMPUS_DB_NAME,
      });

      await campusClient.connect();

      encryptPassword(req.body.password, async (err, hash) => {
        if (err) return res.status(500).json(err);

        try {
          // query user data based on NIM
          const campusRes = await campusClient.query(
            "SELECT * FROM student WHERE nim = $1 LIMIT 1",
            [req.body.nim],
          );
          if (campusRes.rows.length < 1) return res.sendStatus(404);

          await campusClient.end();
          // inserts new data into isab database
          const studentData = campusRes.rows[0];
          try {
            const result = await client.query(
              `
                INSERT INTO "user" (nim, first_name, last_name, email, phone, password, date_created, date_updated)
                VALUES($1, $2, $3, $4, $5, $6, NOW(), NOW())
                RETURNING id_user;
              `,
              [
                studentData.nim,
                studentData.first_name,
                studentData.last_name,
                studentData.email,
                studentData.phone,
                hash,
              ],
            );

            // new user registration is successful
            res
              .status(201)
              .json({ auth_token: generateToken(result.rows[0].id_user) });
          } catch (err) {
            return handleError(res, err);
          }
        } catch (err) {
          return handleError(res, err);
        }
      });
    });
  else
    requireParamsAfter(
      req,
      res,
      ["first_name", "last_name", "email", "phone", "password"],
      async () => {
        // registers company user
        encryptPassword(req.body.password, async (err, hash) => {
          try {
            const result = await client.query(
              `
              INSERT INTO "user"(first_name, last_name, email, phone, password, date_created, date_updated)
              VALUES($1, $2, $3, $4, $5, NOW(), NOW())
              RETURNING id_user;
            `,
              [
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.phone,
                hash,
              ],
            );

            res
              .status(201)
              .json({ auth_token: generateToken(result.rows[0].id_user) });
          } catch (err) {
            return handleError(res, err);
          }
        });
      },
    );
});

router.post(
  "/login",
  requireParams(["email", "password"]),
  async (req, res) => {
    // verifies password
    try {
      const result = await client.query(
        `SELECT id_user, password FROM "user" WHERE email = $1 LIMIT 1;`,
        [req.body.email],
      );
      if (result.rows.length < 1) return res.sendStatus(404);

      comparePassword(
        req.body.password,
        result.rows[0].password,
        (err, isPasswordMatch) => {
          if (err) {
            console.log("is error???");
            console.log(err);
            return res.status(500).json(err);
          }
          if (!isPasswordMatch) return res.sendStatus(401);

          res
            .status(200)
            .json({ auth_token: generateToken(result.rows[0].id_user) });
        },
      );
    } catch (err) {
      return handleError(res, err);
    }
  },
);

module.exports = router;
