import { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');

  if (!isOpen) return null;

  const manejarAutenticacion = (e) => {
    e.preventDefault();

    if (esRegistro) {
      if (!nombre || !email || !password) return alert("Completa tus datos para crear tu Identidad Digital");
      
      const nuevoUsuario = {
        name: nombre,
        email: email,
        avatar: "🌱", 
        co2Saved: 0,
        itemsShared: 0,
        isNew: true
      };
      
      onLogin(nuevoUsuario);
    } 
    else {
      if (!email || !password) return alert("Ingresa tus credenciales para acceder al Garaje");
      
      const usuarioExistente = {
        name: email.split('@')[0], 
        email: email,
        avatar: "🛡️",
        co2Saved: 15.4,
        itemsShared: 4,
        isNew: false
      };
      
      onLogin(usuarioExistente);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0B0F19]/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-[#161B28] w-full max-w-md rounded-[3.5rem] p-12 border border-white/10 shadow-[0_0_50px_rgba(34,197,94,0.1)] relative animate-in zoom-in duration-300">
        
        {/* BOTÓN CIERRE */}
        <button 
          onClick={onClose} 
          className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors font-black text-xl"
        >
          ✕
        </button>
        
        <header className="text-center mb-10">
          <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-500/20">
             <span className="text-4xl">{esRegistro ? "🌱" : "🔐"}</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-3">
            {esRegistro ? "Unirse a la" : "Entrar a la"} <br />
            <span className="text-green-500">Red Circular</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            {esRegistro ? "Crea tu Identidad Digital hoy." : "Gestiona tus activos ociosos."} [cite: 2026-03-01]
          </p>
        </header>

        <form className="space-y-4" onSubmit={manejarAutenticacion}>
          {esRegistro && (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Nombre de Eco Guerrero</label>
              <input 
                type="text" 
                placeholder="Ej. EcoGuerrero_01" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-5 bg-[#0B0F19] rounded-[1.5rem] border border-white/5 outline-none focus:border-green-500 text-white text-sm font-bold transition-all"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Credenciales de Acceso</label>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 bg-[#0B0F19] rounded-[1.5rem] border border-white/5 outline-none focus:border-green-500 text-white text-sm transition-all"
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 bg-[#0B0F19] rounded-[1.5rem] border border-white/5 outline-none focus:border-green-500 text-white text-sm transition-all"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-green-900/20 mt-4 active:scale-95 text-xs"
          >
            {esRegistro ? "Activar Perfil ReSOLVE" : "Entrar al Garaje Digital"}
          </button>
        </form>

        <div className="mt-10 text-center pt-8 border-t border-white/5">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-4">
            Al {esRegistro ? "unirte" : "entrar"}, aceptas extender la vida útil de los activos.
          </p>
          <button 
            onClick={() => setEsRegistro(!esRegistro)}
            className="text-white font-black text-[10px] uppercase tracking-widest hover:text-green-500 transition-colors"
          >
            {esRegistro ? "— ¿Ya tienes cuenta? Entra aquí" : "— ¿Eres nuevo? Únete a la economía circular"}
          </button>
        </div>
      </div>
    </div>
  );
}