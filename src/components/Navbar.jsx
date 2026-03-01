import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../pages/Auth/AuthModal'; 
import logo from '../assets/Logo.png';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sesionGuardada = localStorage.getItem('sharehub_user');
    if (sesionGuardada) {
      setUsuario(JSON.parse(sesionGuardada));
    }
  }, []);

  const loginSuccess = (datos) => {
    setUsuario(datos);
    localStorage.setItem('sharehub_user', JSON.stringify(datos));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('sharehub_user');
    navigate('/');
  };

  return (
    <>
      <nav className="bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex justify-between items-center sticky top-0 z-[80] transition-all">
        
        {/* BRANDING: ESTILO TECH */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img src={logo} alt="ShareHub Logo" className="w-9 h-9 object-contain brightness-125 group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter leading-none italic uppercase">ShareHub</span>
            <span className="text-[8px] font-black text-green-500 tracking-[0.2em] leading-none mt-1">CIRCULAR NETWORK</span>
          </div>
        </Link>

        {/* NAVEGACIÓN CENTRAL: MINIMALISTA */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { name: 'Catálogo', path: '/catalog' },
            { name: 'Impacto', path: '/impact' },
            { name: 'Confianza', path: '/trust' }
          ].map((item) => (
            <Link 
              key={item.name}
              to={item.path} 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:tracking-[0.3em] transition-all duration-300"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* ÁREA DE ACCESO / PERFIL RE-SOLVE */}
        <div className="flex items-center gap-6">
          {!usuario ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition"
              >
                Entrar
              </button>
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 transition-colors shadow-lg shadow-white/5 active:scale-95"
              >
                Unirse
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-5">
              <Link 
                to="/garage" 
                className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-[1.5rem] hover:bg-white/10 hover:border-green-500/30 transition-all group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{usuario.avatar || '👤'}</span>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{usuario.name}</span>
                  <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest leading-none mt-1">Mi Garage</span>
                </div>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                title="Cerrar Sesión"
              >
                <span className="text-lg">➔</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Modal de Autenticación */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={loginSuccess}
      />
    </>
  );
}