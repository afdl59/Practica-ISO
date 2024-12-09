import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/payments/Cancel.css';

export default function Cancel() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/perfil');
  };

  return (
    <div className="cancel-container">
      <h1>Pago Cancelado</h1>
      <p>Hubo un problema al procesar tu pago. No se ha realizado ningún cargo.</p>
      <button className="cancel-button" onClick={handleGoBack}>
        Volver al Perfil
      </button>
    </div>
  );
}
