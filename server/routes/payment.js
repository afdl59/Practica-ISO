const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const authenticate = require('../middleware/auth');

// Crear sesión de pago
router.post('/create-checkout-session', async (req, res) => {
    const { userId } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: 'price_id_from_stripe_dashboard',
                    quantity: 1,
                },
            ],
            success_url: 'http://your-site.com/success',
            cancel_url: 'http://your-site.com/cancel',
            metadata: { userId }, // Añadir metadata
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook de Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata.userId;

            // Actualizar el estado del usuario a premium
            await User.findByIdAndUpdate(userId, { isPremium: true });
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error('Error procesando el webhook:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// Endpoint protegido para actualizar premium manualmente
router.post('/update-premium', authenticate, async (req, res) => {
    const { userId } = req.body;

    try {
        await User.findByIdAndUpdate(userId, { isPremium: true });
        res.status(200).json({ message: 'User upgraded to premium.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

