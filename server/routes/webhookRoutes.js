const express = require('express');
const Stripe = require('stripe');
const userController = require('../controllers/userController'); // Controlador de usuarios

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    // Manejar el evento de sesión completada
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_email; // Email del cliente

      if (email) {
        try {
          // Buscar al usuario por su email y actualizar el estado de isPremium
          await userController.updatePremiumStatusByEmail(email);
          console.log(`Estado de isPremium actualizado para el usuario con email: ${email}`);
        } catch (error) {
          console.error('Error al actualizar el estado de isPremium:', error);
        }
      }
    }

    res.status(200).send('Evento procesado');
  } catch (err) {
    console.error('Error en el webhook de Stripe:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;
