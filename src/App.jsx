import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 

// Páginas (Basado en tu estructura real de carpetas)
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Garage from './pages/Garage';
import Impact from './pages/Impact';
import Trust from './pages/Trust';

// Autenticación (Están en la raíz de /src según tu VS Code)
import Login from './Login'; 
import Register from './Register'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0B0F19]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/trust" element={<Trust />} />
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