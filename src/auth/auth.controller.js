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
