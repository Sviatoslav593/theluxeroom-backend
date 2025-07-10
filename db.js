const express = require("express");
const { Client } = require("pg");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/submit", async (req, res) => {
  const {
    "first-name": firstName,
    "last-name": lastName,
    address,
    city,
    phone,
    comments,
  } = req.body;

  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "onlinestore",
    user: "sviatoslavpotapenko",
    password: "1234",
  });

  await client.connect();

  await client.query(
    `INSERT INTO users (first_name, last_name, address, city, phone, comments)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [firstName, lastName, address, city, phone, comments]
  );

  await client.end();

  res.send("✅ Замовлення прийнято!");
});
