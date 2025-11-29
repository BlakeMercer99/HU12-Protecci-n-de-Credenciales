// user.model.js
import { pool } from "../db/db.js"; // 🟢 ¡Asegúrate de que esta ruta a tu db.js es correcta!

export const UserModel = {
    // -----------------------------------
    // BUSCAR USUARIO
    // -----------------------------------
    findByEmail: async (email) => {
        const query = `SELECT * FROM usuarios WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    // -----------------------------------
    // REGISTRAR USUARIO
    // -----------------------------------
    register: async (nombre, email, hashedPassword) => {
        const query = `
            INSERT INTO usuarios (nombre, email, password, failed_attempts, is_locked)
            VALUES ($1, $2, $3, 0, FALSE)
            RETURNING id, nombre, email
        `;
        const result = await pool.query(query, [nombre, email, hashedPassword]);
        return result.rows[0];
    },

    // -----------------------------------
    // ACTUALIZAR INTENTOS FALLIDOS (Refactorizado de login)
    // -----------------------------------
    updateAttempts: async (userId, newAttempts, isLocked) => {
        const query = `
            UPDATE usuarios 
            SET failed_attempts = $1, is_locked = $2 
            WHERE id = $3
            RETURNING id;
        `;
        await pool.query(query, [newAttempts, isLocked, userId]);
    }
};