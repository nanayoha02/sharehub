import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes Globales
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 

// Páginas (Pages)
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Garage from './pages/Garage';
import Impact from './pages/Impact';
import Trust from './pages/Trust';
import Login from './pages/Login';    // Importación corregida
import Register from './pages/Register'; // Importación corregida

function App() {
  // Nota: Ya no necesitamos 'activos' aquí porque Catalog y Garage 
  // consultan directamente a Supabase para estar siempre sincronizados.

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        {/* El Navbar solo se muestra si NO estamos en Login o Register para mantener el diseño limpio */}
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Rutas Principales */}
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/trust" element={<Trust />} />

            {/* Rutas de Autenticación (Tus nuevas pantallas) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;