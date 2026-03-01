import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../pages/Auth/AuthModal'; 
import logo from '../assets/Logo.png';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para menú móvil
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
      <nav className="bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-[80]">
        
        {/* BRANDING */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0">
          <img src={logo} alt="ShareHub" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black text-white italic uppercase leading-none">ShareHub</span>
            <span className="text-[7px] md:text-[8px] font-black text-green-500 tracking-[0.2em] mt-1">CIRCULAR NETWORK</span>
          </div>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          {[{ name: 'Catálogo', path: '/catalog' }, { name: 'Impacto', path: '/impact' }, { name: 'Confianza', path: '/trust' }].map((item) => (
            <Link key={item.name} to={item.path} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">
              {item.name}
            </Link>
          ))}
        </div>

        {/* ACCESO / PERFIL */}
        <div className="flex items-center gap-3 md:gap-6">
          {!usuario ? (
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => setIsAuthOpen(true)} className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase px-2">
                Entrar
              </button>
              <button onClick={() => setIsAuthOpen(true)} className="bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase hover:bg-green-500 transition-colors">
                Unirse
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/garage" className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-full hover:border-green-500/50">
                <span className="text-base">{usuario.avatar || '👤'}</span>
                <span className="hidden xs:block text-[10px] font-black text-white uppercase">{usuario.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 text-lg">➔</button>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={loginSuccess} />
    </>
  );
}