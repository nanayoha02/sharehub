import React from 'react';

const Trust = () => {
  return (
    <section className="impacto-container">
      <h2 style={{ color: '#2d6a4f', marginBottom: '30px' }}>¿Cómo funciona ShareHub?</h2>
      
      <div className="stats-grid">
        {/* Pilar 1: Share (Compartir) */}
        <div className="stat-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🤝</div>
            <h3 style={{ color: '#2d6a4f' }}>Share (Compartir)</h3>
            <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.4' }}>
                Facilitamos que varios usuarios utilicen un mismo activo, extendiendo su vida útil y evitando la compra de productos nuevos.
            </p>
        </div>

        {/* Pilar 2: Optimize (Optimizar) */}
        <div className="stat-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚙️</div>
            <h3 style={{ color: '#2d6a4f' }}>Optimize (Optimizar)</h3>
            <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.4' }}>
                Mejoramos la eficiencia de activos que actualmente están ociosos, como herramientas o espacios de almacenamiento.
            </p>
        </div>

        {/* Pilar 3: Virtualize (Virtualizar) */}
        <div className="stat-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💻</div>
            <h3 style={{ color: '#2d6a4f' }}>Virtualize (Virtualizar)</h3>
            <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.4' }}>
                Sustituimos la necesidad de tiendas físicas de segunda mano por esta plataforma digital de gestión de activos.
            </p>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#d8f3dc', borderRadius: '10px' }}>
          <p style={{ fontWeight: 'bold', color: '#1b4332', margin: 0 }}>
              Basado en la Economía del Rendimiento: Priorizamos el acceso sobre la propiedad.
          </p>
      </div>
    </section>
  );
};

export default Trust;