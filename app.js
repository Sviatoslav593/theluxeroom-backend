const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при запиті до бази");
  }
});

app.listen(3000, () => {
  console.log("🌐 Сервер запущено на http://localhost:3000");
});
