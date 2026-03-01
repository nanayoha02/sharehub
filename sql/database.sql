-- SCRIPT DE INFRAESTRUCTURA SHAREHUB 2026 - CORREGIDO
-- Basado en Modelo ReSOLVE (Share, Optimize, Virtualize)

-- 1. USUARIOS
CREATE TABLE users (
  id_usuario UUID PRIMARY KEY DEFAULT auth.uid(),
  nombre_completo TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono_whatsapp TEXT,
  co2_ahorrado_total FLOAT8 DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. CATEGORÍAS
CREATE TABLE categories (
  id_categoria SERIAL PRIMARY KEY,
  nombre_categoria TEXT NOT NULL UNIQUE
);

-- 3. ACTIVOS (GARAGE DIGITAL)
-- Nota: Se agregó telefono_contacto y se flexibilizó id_propietario para desarrollo.
CREATE TABLE assets (
  id_activo SERIAL PRIMARY KEY,
  id_propietario UUID REFERENCES users(id_usuario) ON DELETE CASCADE,
  nombre_articulo TEXT NOT NULL,
  descripcion TEXT,
  id_categoria INTEGER REFERENCES categories(id_categoria),
  estado TEXT CHECK (estado IN ('Nuevo', 'Excelente', 'Muy Bueno', 'Funcional')),
  precio_dia FLOAT8 NOT NULL,
  peso_kg FLOAT8 NOT NULL,
  disponible BOOLEAN DEFAULT true,
  ubicacion_texto TEXT,
  telefono_contacto TEXT, -- CAMPO AÑADIDO PARA CONTACTO DIRECTO
  foto_principal TEXT, -- URL de la imagen destacada
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. IMÁGENES SECUNDARIAS
CREATE TABLE asset_images (
  id_imagen SERIAL PRIMARY KEY,
  id_activo INTEGER REFERENCES assets(id_activo) ON DELETE CASCADE,
  url_imagen TEXT NOT NULL
);

-- 5. TRANSACCIONES E IMPACTO (ODS 12 & 13)
CREATE TABLE transactions (
  id_transaccion SERIAL PRIMARY KEY,
  id_usuario_cliente UUID REFERENCES users(id_usuario),
  id_activo INTEGER REFERENCES assets(id_activo),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  dias_uso INTEGER GENERATED ALWAYS AS (fecha_fin - fecha_inicio) STORED,
  co2_evitado_transaccion FLOAT8, -- Cálculo: peso_kg * 2.5
  total_pago FLOAT8,
  status_transaccion TEXT DEFAULT 'pendiente'
);

-- 6. RESEÑAS
CREATE TABLE reviews (
  id_reseña SERIAL PRIMARY KEY,
  id_activo INTEGER REFERENCES assets(id_activo) ON DELETE CASCADE,
  id_usuario_emisor UUID REFERENCES users(id_usuario),
  puntuacion INTEGER CHECK (puntuacion BETWEEN 1 AND 5),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. POLÍTICAS DE ACCESO RÁPIDAS (RLS)
-- Esto permite que los datos fluyan en tu Garage y Catálogo mientras configuras el login.
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso público total" ON assets FOR ALL USING (true) WITH CHECK (true);

-- INSERT DE CATEGORÍAS INICIALES
INSERT INTO categories (nombre_categoria) VALUES 
('Herramientas'), ('Camping'), ('Electrónica'), ('Hogar'), ('Deportes');