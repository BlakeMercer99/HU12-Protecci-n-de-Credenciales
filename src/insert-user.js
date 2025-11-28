import { pool } from "./db/db.js";
import bcrypt from "bcrypt";

async function insertUser() {
  const nombre = "Test User";
  const correo = "test@mail.com";
  const contrasenaPlano = "1234";

  try {
    const hashed = await bcrypt.hash(contrasenaPlano, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre, correo, hashed]
    );

    console.log("Usuario insertado correctamente:");
    console.log(result.rows[0]);
  } catch (err) {
    console.error("Error insertando usuario:", err);
  } finally {
    pool.end();
  }
}

insertUser();
