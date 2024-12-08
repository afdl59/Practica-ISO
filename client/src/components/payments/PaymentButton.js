import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import '../../styles/payments/PaymentButton.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function PaymentButton({ userEmail }) {
  const handlePayment = async () => {
    try {
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      if (!response.ok) {
        throw new Error('Error en la creación de la sesión de pago');
      }
      
      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Error al redirigir a Stripe:', error);
      }
    } catch (error) {
      console.error('Error al crear la sesión de pago:', error);
    }
  };

  return (
    <button className="payment-button" onClick={handlePayment}>
      Actualizar a Premium
    </button>
  );
}
