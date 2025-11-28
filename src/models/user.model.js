import { pool } from "../db/db.js";

export const UserModel = {
  findByEmail: async (email) => {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [email]
    );
    return result.rows[0];
  },

  register: async (nombre, correo, hashedPassword) => {
    await pool.query(
      `INSERT INTO usuarios(nombre, correo, contrasena, failed_attempts, is_locked)
       VALUES ($1, $2, $3, 0, false)`,
      [nombre, correo, hashedPassword]
    );
  },

  updateFailedAttempts: async (user) => {
    await pool.query(
      `UPDATE usuarios SET failed_attempts = $1, is_locked = $2 WHERE id = $3`,
      [user.failed_attempts, user.is_locked, user.id]
    );
  }
};
