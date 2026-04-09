import { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, X } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Verificamos credenciales en la tabla profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password) // En producción, se recomienda usar Supabase Auth
        .single();

      if (error || !data) throw new Error("Credenciales incorrectas. Intenta de nuevo.");

      // 2. Guardamos la sesión local para identificar al Eco Guerrero
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_name', data.nombre_eco_guerrero);
      
      // 3. Redirigimos al Garage para que gestione sus activos
      navigate('/garage');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 relative">
      {/* Botón de Cerrar (X) para volver al Home */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-md text-center">
        
        {/* ÍCONO DEL CANDADO (Basado en tu imagen) */}
        <div className="mx-auto w-20 h-20 bg-[#161B28] rounded-[2rem] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
          <div className="bg-gradient-to-br from-amber-300 to-amber-500 p-2.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Lock size={24} className="text-[#0B0F19]" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-black uppercase italic leading-[0.9] tracking-tighter text-white mb-2">
          ENTRAR A LA <br />
          <span className="text-green-500">RED CIRCULAR</span>
        </h2>
        
        <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] mb-12">
          GESTIONA TUS ACTIVOS OCIOSOS. [CITE: 2026-03-01]
        </p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-500 ml-6 block">Credenciales de Acceso</label>
            <input 
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#161B28] border border-white/5 p-5 rounded-[1.8rem] text-white outline-none focus:border-green-500/30 transition-all placeholder:text-slate-700"
            />
          </div>

          <input 
            required
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#161B28] border border-white/5 p-5 rounded-[1.8rem] text-white outline-none focus:border-green-500/30 transition-all placeholder:text-slate-700"
          />

          <button 
            disabled={loading}
            className="w-full bg-[#00B341] text-white font-black uppercase py-5 rounded-[2rem] text-xs tracking-[0.15em] hover:bg-[#00D14C] transition-all shadow-xl shadow-green-900/20 mt-6 active:scale-[0.98]"
          >
            {loading ? "VERIFICANDO..." : "ENTRAR AL GARAJE DIGITAL"}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-white/5">
          <p className="text-[9px] text-slate-600 uppercase font-bold mb-6 px-10 leading-relaxed">
            Al entrar, aceptas extender la vida útil de los activos.
          </p>
          
          <Link 
            to="/register" 
            className="text-[10px] text-white font-black uppercase tracking-widest hover:text-green-500 transition-colors"
          >
            — ¿ERES NUEVO? ÚNETE A LA ECONOMÍA CIRCULAR
          </Link>
        </div>
      </div>
    </div>
  );
}