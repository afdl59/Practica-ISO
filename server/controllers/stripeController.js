const { createCheckoutSession } = require('../services/stripeService');

const createSession = async (req, res) => {
  const { email } = req.body; // Asegúrate de recibir el email del usuario desde el frontend
  if (!email) {
    return res.status(400).json({ error: 'El email es requerido' });
  }
  try {
    const session = await createCheckoutSession(email);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear la sesión de pago' });
  }
};

module.exports = { createSession };
