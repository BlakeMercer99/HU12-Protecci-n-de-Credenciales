import { AuthService } from "./auth.service.js";

export async function loginController(req, res) {
  const { email, password } = req.body;

  try {
    const data = await AuthService.login(email, password);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function registerController(req, res) {
  const { nombre, email, password } = req.body;

  try {
    const data = await AuthService.register(nombre, email, password);
    res.json(data);
  } catch (err) {
    console.error("ERROR COMPLETO:", err);
    res.status(400).json({ error: err.message });
  }
}
