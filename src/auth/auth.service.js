import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { comparePassword } from "./password.utils.js";

export const AuthService = {
  async login(email, password) {
    // Buscar usuario
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Verificar bloqueo
    if (user.is_locked) {
      throw new Error("Cuenta bloqueada. Contacte al administrador.");
    }

    // Comparar contraseñas
    const valid = await comparePassword(password, user.contrasena);

    if (!valid) {
      const nuevosIntentos = user.failed_attempts + 1;

      // Si llega a 3 → bloqueado
      const bloquear = nuevosIntentos >= 3;

      // Actualizar en BD
      await UserModel.updateFailedAttempts({
        id: user.id,
        failed_attempts: nuevosIntentos,
        is_locked: bloquear
      });

      if (bloquear) {
        throw new Error("Cuenta bloqueada por demasiados intentos fallidos.");
      }

      throw new Error("Contraseña incorrecta.");
    }

    // Login exitoso → reset de intentos
    await UserModel.updateFailedAttempts({
      id: user.id,
      failed_attempts: 0,
      is_locked: false
    });

    // Crear token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.correo,
      },
      process.env.JWT_SECRET || "supersecreto123",
      { expiresIn: "1h" }
    );

    return { message: "Login exitoso", token };
  }
};
