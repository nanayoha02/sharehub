import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Garage from './pages/Garage';
import Impact from './pages/Impact';
import Trust from './pages/Trust';

function App() {
  const [activos, setActivos] = useState(() => {
    const saved = localStorage.getItem('sharehub_items');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sharehub_items', JSON.stringify(activos));
  }, [activos]);

  const agregarNuevoActivo = (nuevo) => {
    setActivos([...activos, nuevo]);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog items={activos} />} />
            {/* CORRECCIÓN AQUÍ: Se añade setMisActivos */}
            <Route 
              path="/garage" 
              element={
                <Garage 
                  onAdd={agregarNuevoActivo} 
                  misActivos={activos} 
                  setMisActivos={setActivos} 
                />
              } 
            />
            <Route path="/impact" element={<Impact datos={activos} />} />
            <Route path="/trust" element={<Trust />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;