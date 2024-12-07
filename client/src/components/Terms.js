import React from 'react';
import '../styles/termsYconditions/Terms';

const Terms = () => {
    return (
        <div className="terms-container">
            <h1>Términos y Condiciones</h1>
            <p>Última actualización: 07/12/2024</p>
            <section>
                <h2>1. Uso del Servicio</h2>
                <p>
                    El acceso a Futbol360 está destinado a fines personales y no comerciales.
                    Está prohibido usar el servicio para actividades ilegales o que violen estos términos.
                    Nos reservamos el derecho de suspender o cancelar cuentas en caso de uso indebido.
                </p>
            </section>
            <section>
                <h2>2. Propiedad Intelectual</h2>
                <p>
                    Todo el contenido de Futbol360, incluidas imágenes, textos, y gráficos, es propiedad de Futbol360 o de sus respectivos propietarios y está protegido por leyes de derechos de autor.
                </p>
            </section>
            <section>
                <h2>3. Responsabilidades del Usuario</h2>
                <p>
                    Es responsabilidad del usuario garantizar la confidencialidad de sus credenciales de inicio de sesión.
                    Futbol360 no se responsabiliza por el acceso no autorizado derivado de negligencia del usuario.
                </p>
            </section>
            <section>
                <h2>4. Modificaciones</h2>
                <p>
                    Nos reservamos el derecho de actualizar estos términos en cualquier momento. Cualquier cambio será notificado a través del sitio web.
                </p>
            </section>
            <section>
                <h2>5. Contacta con Nosotros</h2>
                <p>
                    Si tienes preguntas, por favor contáctanos en <a href="mailto:futbol360.client@gmail.com">futbol360.client@gmail.com</a>.
                </p>
            </section>
        </div>
    );
};

export default Terms;
