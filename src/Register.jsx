import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Insertar en la tabla 'profiles' que acabamos de crear
      const { error } = await supabase
        .from('profiles')
        .insert([
          { 
            nombre_eco_guerrero: formData.nombre, 
            email: formData.email, 
            password_hash: formData.password // Nota: En el futuro usaremos Auth de Supabase
          }
        ]);

      if (error) throw error;

      // 2. Guardar sesión local para que el sistema sepa quién califica
      localStorage.setItem('user_email', formData.email);
      localStorage.setItem('user_name', formData.nombre);
      
      alert("¡Perfil Resolve Activado! Bienvenido Eco Guerrero.");
      window.location.href = "/catalog"; // Redirigir al catálogo
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6">
      <form onSubmit={handleRegister} className="w-full max-w-md space-y-6 text-center">
        {/* Ícono de Planta (según tu imagen) */}
        <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mb-8 border border-green-500/20">
          <span className="text-4xl">🌱</span>
        </div>

        <h2 className="text-4xl font-black uppercase italic text-white leading-none">
          Unirse a la <br /><span className="text-green-500">Red Circular</span>
        </h2>
        
        <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mb-8">
          Crea tu identidad digital hoy. [CITE: 2026-03-01]
        </p>

        <div className="space-y-4 text-left">
          <div>
            <label className="text-[8px] font-black uppercase text-slate-500 ml-4">Nombre de Eco Guerrero</label>
            <input 
              required
              className="w-full bg-[#161B28] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-green-500/50"
              placeholder="Ej. EcoGuerrero_01"
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[8px] font-black uppercase text-slate-500 ml-4">Email</label>
            <input 
              required
              type="email"
              className="w-full bg-[#161B28] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-green-500/50"
              placeholder="tu@email.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[8px] font-black uppercase text-slate-500 ml-4">Contraseña</label>
            <input 
              required
              type="password"
              className="w-full bg-[#161B28] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-green-500/50"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-green-500 text-black font-black uppercase py-5 rounded-3xl text-xs tracking-widest hover:bg-[#B7FF2A] transition-all"
        >
          {loading ? "Sincronizando..." : "Activar Perfil Resolve"}
        </button>

        <p className="text-[9px] text-slate-600 uppercase font-bold mt-8">
          Al unirte, aceptas extender la vida útil de los activos.
        </p>
      </form>
    </div>
  );
}