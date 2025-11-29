import bcrypt from "bcrypt";
import { pool } from "./db/db.js";

const nombre = "Test";
const email = "[test@mail.com](mailto:test@mail.com)";
const password = "ClaveSegura123!";

const run = async () => {
const hashed = await bcrypt.hash(password, 10);

const query = `     INSERT INTO usuarios (nombre, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

const result = await pool.query(query, [nombre, email, hashed]);

console.log("Usuario insertado:", result.rows[0]);
};

run();
