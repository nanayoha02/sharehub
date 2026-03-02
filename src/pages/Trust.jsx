import React from 'react';

const Trust = ({ userRating, totalShares, co2SavedByUser }) => {
  return (
    <div className="trust-module">
      {/* 1. Validación de Comunidad (Estrellas del boceto) */}
      <div className="rating-section">
        <h3>Nivel de Confianza</h3>
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < userRating ? "star-filled" : "star-empty"}>★</span>
          ))}
        </div>
        <p>{totalShares} activos compartidos con éxito</p>
      </div>

      <hr />

      {/* 2. Validación de Impacto (Conecta con ODS 13) */}
      <div className="eco-validation">
        <h4>Sello de Impacto Real</h4>
        <div className="badge">
          <span className="leaf-icon">🌱</span>
          <span>Has evitado {co2SavedByUser}kg de CO2</span>
        </div>
        <p className="small-text">Basado en el modelo de Economía del Rendimiento</p>
      </div>
    </div>
  );
};

export default Trust;