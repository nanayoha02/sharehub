import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes Globales
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 

// Páginas de la carpeta /pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Garage from './pages/Garage';
import Impact from './pages/Impact';
import Trust from './pages/Trust';

// Componentes de Autenticación (Asegúrate de haberlos renombrado a .jsx)
import Login from './Login'; 
import Register from './Register'; 

function App() {
  return (
    <Router>
      {/* Contenedor principal con el fondo oscuro oficial de la Red Circular */}
      <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/trust" element={<Trust />} />
            
            {/* Rutas de acceso para el Eco Guerrero */}
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