const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (userEmail) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail, // Email del usuario para asociarlo al pago
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Suscripción Premium - Futbol360',
            },
            unit_amount: 500, // Precio en céntimos (500 = 5€)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
    return session;
  } catch (error) {
    console.error('Error al crear sesión de pago:', error);
    throw error;
  }
};

module.exports = { createCheckoutSession };
