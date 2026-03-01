import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
        
        {/* Columna 1: Marca y Propósito */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ShareHub Logo" className="w-10 h-10 object-contain brightness-110" />
            <span className="text-2xl font-black text-white tracking-tighter italic uppercase">ShareHub</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed font-medium uppercase tracking-wider">
            Maximizando activos, minimizando desperdicios. <br />
            <span className="text-green-500/80">Una respuesta directa a la crisis ambiental [cite: 2026-03-01].</span>
          </p>
          <div className="flex gap-4 pt-2">
            <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm grayscale hover:grayscale-0 cursor-pointer transition-all hover:border-green-500">📱</span>
            <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm grayscale hover:grayscale-0 cursor-pointer transition-all hover:border-green-500">📸</span>
            <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm grayscale hover:grayscale-0 cursor-pointer transition-all hover:border-green-500">💬</span>
          </div>
        </div>

        {/* Columna 2: Modelo ReSOLVE */}
        <div>
          <h4 className="font-black text-white mb-8 text-[10px] uppercase tracking-[0.3em]">Modelo ReSOLVE</h4>
          <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <li>
              <Link to="/catalog" className="hover:text-green-500 transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-green-500 rounded-full"></span> Share (Compartir)
              </Link>
            </li>
            <li>
              <Link to="/garage" className="hover:text-green-500 transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-green-500 rounded-full"></span> Optimize (Optimizar)
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-green-500 transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-green-500 rounded-full"></span> Virtualize (Virtualizar)
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Infraestructura */}
        <div>
          <h4 className="font-black text-white mb-8 text-[10px] uppercase tracking-[0.3em]">Infraestructura</h4>
          <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <li><Link to="/trust" className="hover:text-white transition-colors">Centro de Confianza</Link></li>
            <li><Link to="/impact" className="hover:text-white transition-colors">Panel de Impacto</Link></li>
            <li className="hover:text-white cursor-pointer transition-colors">Seguro ShareGuard</li>
            <li className="hover:text-white cursor-pointer transition-colors">Soporte 24/7</li>
          </ul>
        </div>

        {/* Columna 4: Newsletter Sostenible */}
        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
          <h4 className="font-black text-white mb-4 text-[10px] uppercase tracking-[0.3em]">Únete al cambio</h4>
          <p className="text-slate-500 text-[10px] mb-6 font-bold uppercase tracking-widest">Recibe reportes de impacto real.</p>
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="TU EMAIL" 
              className="bg-[#0B0F19] border border-white/10 rounded-2xl p-4 text-[10px] font-black text-white focus:border-green-500 outline-none transition-all uppercase tracking-widest"
            />
            <button className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all active:scale-95 shadow-lg shadow-green-900/20">
              Suscribir
            </button>
          </div>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="max-w-7xl mx-auto px-8 mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center">
        <div className="flex flex-col md:flex-row items-center gap-4">
           <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic">
             © 2026 ShareHub — Basado en la Economía del Rendimiento [cite: 2026-03-01].
           </p>
        </div>
        <div className="flex gap-8 text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
          <span className="hover:text-white cursor-pointer transition-colors">Privacidad</span>
          <span className="hover:text-white cursor-pointer transition-colors">Términos</span>
          <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
        </div>
      </div>
    </footer>
  );
}