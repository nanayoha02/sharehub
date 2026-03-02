import React from 'react';

const Trust = () => {
  // Definición de colores basada en tu interfaz oficial
  const colors = {
    background: '#0a0e17', // Fondo oscuro profundo
    cardBg: '#161b22',      // Fondo de tarjeta sutil
    primaryGreen: '#00e676', // Verde vibrante de los títulos
    limeGreen: '#ccff00',    // Verde lima de los acentos/botones
    textWhite: '#ffffff',
    textGray: '#8b949e'
  };

  const cardStyle = {
    backgroundColor: colors.cardBg,
    padding: '30px',
    borderRadius: '24px', // Bordes redondeados modernos
    border: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'left',
    flex: '1',
    minWidth: '280px'
  };

  const titleStyle = {
    color: colors.primaryGreen,
    fontSize: '1.8rem',
    fontWeight: '900',
    textTransform: 'uppercase', // Estilo "PANEL DE IMPACTO"
    marginBottom: '15px',
    letterSpacing: '-1px'
  };

  return (
    <section style={{ backgroundColor: colors.background, padding: '60px 5%', borderRadius: '30px' }}>
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ ...titleStyle, fontSize: '3rem', lineHeight: '1' }}>
          EL MODELO <span style={{ color: colors.textWhite }}>ReSOLVE</span>
        </h2>
        <p style={{ color: colors.textGray, maxWidth: '700px', fontSize: '1.1rem' }}>
          Maximizando activos, minimizando desperdicios: nuestra respuesta directa a la economía lineal.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Pilar 1: Share */}
        <div style={cardStyle}>
          <div style={{ color: colors.limeGreen, fontSize: '1.5rem', marginBottom: '20px' }}>● 01</div>
          <h3 style={titleStyle}>Share</h3>
          <p style={{ color: colors.textWhite, opacity: 0.8, lineHeight: '1.6' }}>
            Facilitamos que varios usuarios utilicen un mismo activo, extendiendo su vida útil y evitando la compra de productos nuevos.
          </p>
        </div>

        {/* Pilar 2: Optimize */}
        <div style={cardStyle}>
          <div style={{ color: colors.limeGreen, fontSize: '1.5rem', marginBottom: '20px' }}>● 02</div>
          <h3 style={titleStyle}>Optimize</h3>
          <p style={{ color: colors.textWhite, opacity: 0.8, lineHeight: '1.6' }}>
            Mejoramos la eficiencia de activos ociosos, como herramientas o espacios, transformando la inactividad en valor.
          </p>
        </div>

        {/* Pilar 3: Virtualize */}
        <div style={cardStyle}>
          <div style={{ color: colors.limeGreen, fontSize: '1.5rem', marginBottom: '20px' }}>● 03</div>
          <h3 style={titleStyle}>Virtualize</h3>
          <p style={{ color: colors.textWhite, opacity: 0.8, lineHeight: '1.6' }}>
            Sustituimos la infraestructura física por una plataforma digital de gestión de activos inteligente.
          </p>
        </div>
      </div>

      {/* Banner de Economía del Rendimiento */}
      <div style={{ 
        marginTop: '40px', 
        padding: '25px', 
        background: `linear-gradient(90deg, ${colors.primaryGreen}, ${colors.limeGreen})`, 
        borderRadius: '15px',
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1.2rem'
      }}>
        ACCESO SOBRE PROPIEDAD: PRIORIZANDO EL SERVICIO Y EL RENDIMIENTO.
      </div>
    </section>
  );
};

export default Trust;