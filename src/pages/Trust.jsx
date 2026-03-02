import React from 'react';

const Trust = () => {
  // Paleta de colores extraída de tu Dashboard oficial
  const styleConfig = {
    darkBg: '#0a0e17',      // Fondo principal
    cardBg: '#161b22',      // Fondo de las tarjetas
    neonGreen: '#00e676',   // Verde de los títulos
    limeGreen: '#ccff00',   // Verde lima de acentos
    whiteText: '#ffffff',
    grayText: '#8b949e'
  };

  const sectionStyle = {
    backgroundColor: styleConfig.darkBg,
    padding: '60px 5%',
    fontFamily: "'Inter', sans-serif",
    color: styleConfig.whiteText
  };

  const gridStyle = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '40px'
  };

  const cardStyle = {
    backgroundColor: styleConfig.cardBg,
    padding: '40px',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    flex: '1',
    minWidth: '300px',
    transition: 'transform 0.3s ease'
  };

  const hugeTitle = {
    fontSize: '4rem',
    fontWeight: '900',
    lineHeight: '0.9',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    letterSpacing: '-2px'
  };

  return (
    <section style={sectionStyle}>
      {/* Encabezado de Impacto */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ ...hugeTitle, color: styleConfig.whiteText }}>EL MODELO</h2>
        <h2 style={{ ...hugeTitle, color: styleConfig.neonGreen }}>RESOLVE</h2>
        <p style={{ color: styleConfig.grayText, fontSize: '1.2rem', marginTop: '20px', maxWidth: '600px' }}>
          Maximizando activos, minimizando desperdicios. Nuestra infraestructura digital para la economía del rendimiento.
        </p>
      </div>

      <div style={gridStyle}>
        {/* Pilar 1: Share */}
        <div style={cardStyle}>
          <div style={{ color: styleConfig.limeGreen, fontWeight: 'bold', marginBottom: '15px' }}>// 01. COMPARTIR</div>
          <h3 style={{ color: styleConfig.neonGreen, fontSize: '1.5rem', marginBottom: '15px', textTransform: 'uppercase' }}>Share</h3>
          <p style={{ color: styleConfig.whiteText, opacity: 0.8, lineHeight: '1.6' }}>
            Facilitamos que varios usuarios utilicen un mismo activo, extendiendo su vida útil y evitando la fabricación innecesaria.
          </p>
        </div>

        {/* Pilar 2: Optimize */}
        <div style={cardStyle}>
          <div style={{ color: styleConfig.limeGreen, fontWeight: 'bold', marginBottom: '15px' }}>// 02. OPTIMIZAR</div>
          <h3 style={{ color: styleConfig.neonGreen, fontSize: '1.5rem', marginBottom: '15px', textTransform: 'uppercase' }}>Optimize</h3>
          <p style={{ color: styleConfig.whiteText, opacity: 0.8, lineHeight: '1.6' }}>
            Mejoramos la eficiencia de activos ociosos. Si no se usa, se comparte. Maximizamos el rendimiento de cada producto.
          </p>
        </div>

        {/* Pilar 3: Virtualize */}
        <div style={cardStyle}>
          <div style={{ color: styleConfig.limeGreen, fontWeight: 'bold', marginBottom: '15px' }}>// 03. VIRTUALIZAR</div>
          <h3 style={{ color: styleConfig.neonGreen, fontSize: '1.5rem', marginBottom: '15px', textTransform: 'uppercase' }}>Virtualize</h3>
          <p style={{ color: styleConfig.whiteText, opacity: 0.8, lineHeight: '1.6' }}>
            Sustituimos la propiedad física por el acceso digital. Gestionamos activos, no solo objetos.
          </p>
        </div>
      </div>

      {/* Footer del componente al estilo 'RESERVA. NO COMPRES' */}
      <div style={{ 
        marginTop: '60px', 
        borderTop: `1px solid ${styleConfig.cardBg}`, 
        paddingTop: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ 
          backgroundColor: styleConfig.limeGreen, 
          color: '#000', 
          padding: '10px 20px', 
          fontWeight: '900', 
          borderRadius: '5px' 
        }}>
          ODS 12 + 13
        </div>
        <p style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Acceso sobre propiedad: El futuro es circular.
        </p>
      </div>
    </section>
  );
};

export default Trust;