// auth.services.js
import bcrypt from "bcrypt";
// ❌ ELIMINAR: import { pool } from "../db/db.js"; 
import { isPasswordSecure } from "../utils/password.utils.js";
import { UserModel } from "../models/user.model.js"; // 🟢 Importar el modelo

export const AuthService = {
    // -----------------------------------
    // LOGIN (Refactorizado para usar UserModel)
    // -----------------------------------
    login: async (email, password) => {
        // 1. Obtener usuario
        const user = await UserModel.findByEmail(email);

        if (!user) {
            throw new Error("Credenciales inválidas."); // Mensaje genérico por seguridad
        }

        // 2. Verificar bloqueo
        if (user.is_locked) {
            throw new Error("Cuenta bloqueada. Contacte a un administrador.");
        }

        // 3. Comparar contraseña
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            const newAttempts = (user.failed_attempts || 0) + 1;
            let isLocked = false;
            let errorMessage = "Contraseña incorrecta.";

            if (newAttempts >= 5) {
                isLocked = true;
                errorMessage = "Cuenta bloqueada por intentos fallidos.";
            }

            // 4. Actualizar intentos y bloqueo en el modelo
            await UserModel.updateAttempts(user.id, newAttempts, isLocked);

            throw new Error(errorMessage);
        }

        // 5. Login exitoso: Resetear intentos
        await UserModel.updateAttempts(user.id, 0, false);

        // Devolver usuario sin la contraseña
        const { password: _, ...userWithoutPassword } = user;
        
        return { message: "Login exitoso", user: userWithoutPassword };
    },

    // -----------------------------------
    // REGISTER (Corregido para usar UserModel)
    // -----------------------------------
    register: async (nombre, email, password) => {
        // 1. Criterio 3: Validar seguridad de contraseña
        if (!isPasswordSecure(password)) {
            throw new Error(
                "La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo."
            );
        }
        
        // 2. Verificar si ya existe
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error("El email ya se encuentra registrado.");
        }

        // 3. Criterio 1: Hashear contraseña
        const hashed = await bcrypt.hash(password, 10);

        // 4. Delegar la inserción al Modelo
        const user = await UserModel.register(nombre, email, hashed);

        return {
            message: "Usuario registrado correctamente",
            user: user,
        };
    },
};