const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "onlinestore",
  user: "sviatoslavpotapenko",
  password: "1234",
});

client
  .connect()
  .then(() => console.log("Підключено до PostgreSQL!"))
  .catch((err) => console.error("Помилка підключення:", err.stack));
