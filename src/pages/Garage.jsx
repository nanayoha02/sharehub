import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Garage() {
  const [misActivos, setMisActivos] = useState([]);
  const [whatsapp, setWhatsapp] = useState(localStorage.getItem('user_wa') || '');
  const [waGuardado, setWaGuardado] = useState(!!localStorage.getItem('user_wa'));
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre_articulo: '',
    id_categoria: 1, 
    descripcion: '',
    estado: 'Excelente',
    precio_dia: '',
    peso_kg: '',
    ubicacion_texto: ''
  });

  useEffect(() => {
    if (waGuardado && whatsapp) {
      fetchMisActivos();
    } else {
      setLoading(false);
      setMisActivos([]);
    }
  }, [waGuardado]);

  async function fetchMisActivos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('telefono_contacto', whatsapp) 
        .order('id_activo', { ascending: false });

      if (error) throw error;
      setMisActivos(data || []);
    } catch (error) {
      console.error("Error al cargar activos:", error.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleDisponibilidad = async (id, estadoActual) => {
    try {
      const { error } = await supabase
        .from('assets')
        .update({ disponible: !estadoActual })
        .eq('id_activo', id)
        .eq('telefono_contacto', whatsapp);

      if (error) throw error;
      setMisActivos(prev => prev.map(a => 
        a.id_activo === id ? { ...a, disponible: !estadoActual } : a
      ));
    } catch (error) {
      alert("Error de red: " + error.message);
    }
  };

  const guardarWhatsapp = () => {
    const numeroLimpio = whatsapp.replace(/\D/g, '');
    if (numeroLimpio.length < 8) return alert("Ingresa un número válido.");
    setWhatsapp(numeroLimpio);
    localStorage.setItem('user_wa', numeroLimpio);
    setWaGuardado(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const assetPayload = {
      ...formData,
      precio_dia: parseFloat(formData.precio_dia),
      peso_kg: parseFloat(formData.peso_kg),
      id_categoria: parseInt(formData.id_categoria),
      telefono_contacto: whatsapp,
      disponible: isEditing ? undefined : true 
    };

    try {
      if (isEditing) {
        await supabase.from('assets').update(assetPayload).eq('id_activo', isEditing);
      } else {
        await supabase.from('assets').insert([assetPayload]);
      }
      setShowForm(false);
      setIsEditing(null);
      setFormData({ nombre_articulo: '', id_categoria: 1, descripcion: '', estado: 'Excelente', precio_dia: '', peso_kg: '', ubicacion_texto: '' });
      fetchMisActivos();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6 pb-24 font-sans">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        {/* HEADER DINÁMICO */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
              Mi <span className="text-green-500">Garage</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">
              ShareHub: Maximizando Activos, Minimizando Desperdicios [cite: 2026-03-01].
            </p>
          </div>
          
          <div className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${waGuardado ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{waGuardado ? "ID VINCULADA" : "ID REQUERIDA"}</p>
              <input 
                type="text" 
                value={whatsapp} 
                onChange={(e) => { setWhatsapp(e.target.value); setWaGuardado(false); }} 
                className="bg-transparent text-sm font-bold border-none focus:ring-0 p-0 text-white w-28" 
                placeholder="WhatsApp" 
              />
            </div>
            <button onClick={guardarWhatsapp} className="bg-white text-black p-2 rounded-xl text-[10px] font-black uppercase hover:bg-green-500 transition-colors">Vincular</button>
          </div>
        </header>

        {waGuardado && (
          <div className="space-y-8">
            {/* BOTÓN O FORMULARIO DE AÑADIR */}
            {!showForm ? (
              <button 
                onClick={() => { setIsEditing(null); setShowForm(true); }} 
                className="group w-full py-12 border-2 border-dashed border-white/10 rounded-[2.5rem] hover:border-green-500/50 hover:bg-green-500/5 transition-all flex flex-col items-center justify-center gap-4"
              >
                <span className="text-4xl group-hover:scale-125 transition-transform">➕</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-green-500">Virtualizar Nuevo Activo</span>
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black uppercase italic italic">{isEditing ? 'Editar Activo' : 'Nuevo Activo'}</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest">Cancelar</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nombre del Activo</label>
                    <input required value={formData.nombre_articulo} onChange={(e) => setFormData({...formData, nombre_articulo: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 p-4 rounded-2xl focus:border-green-500 transition-colors outline-none" placeholder="Ej. Sierra Eléctrica" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Precio/Día</label>
                      <input type="number" required value={formData.precio_dia} onChange={(e) => setFormData({...formData, precio_dia: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none" placeholder="$" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Peso (kg)</label>
                      <input type="number" required value={formData.peso_kg} onChange={(e) => setFormData({...formData, peso_kg: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none" placeholder="kg" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Ubicación de Recogida</label>
                    <input required value={formData.ubicacion_texto} onChange={(e) => setFormData({...formData, ubicacion_texto: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none" placeholder="Ej. La Chorrera, Centro" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest mt-8 transition-all shadow-lg shadow-green-900/20">
                  {isEditing ? "Actualizar Activo" : "Subir al Sistema"}
                </button>
              </form>
            )}

            {/* LISTADO DE ACTIVOS */}
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="py-20 text-center animate-pulse font-black text-slate-500 uppercase tracking-widest text-xs">Sincronizando con la red...</div>
              ) : misActivos.map(activo => (
                <div key={activo.id_activo} className={`group p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row justify-between items-center gap-6 ${activo.disponible ? 'bg-white/5 border-white/10 hover:border-green-500/30' : 'bg-black/40 border-white/5 opacity-60 grayscale'}`}>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-2xl uppercase italic tracking-tighter">{activo.nombre_articulo}</h4>
                      <span className={`text-[8px] font-black px-3 py-1 rounded-full tracking-widest ${activo.disponible ? 'bg-green-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
                        {activo.disponible ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-2 font-medium tracking-tight uppercase">
                      📍 {activo.ubicacion_texto} <span className="mx-2 text-white/10">|</span> <span className="text-green-500">🍃 CO2: -{(activo.peso_kg * 3).toFixed(1)}kg</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Renta/Día</p>
                      <p className="font-black text-3xl italic">${activo.precio_dia}</p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleDisponibilidad(activo.id_activo, activo.disponible)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all border ${activo.disponible ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-slate-800 border-white/5 text-slate-500'}`}
                        title={activo.disponible ? "Ocultar" : "Mostrar"}
                      >
                        {activo.disponible ? '👁️' : '🕶️'}
                      </button>
                      <button onClick={() => iniciarEdicion(activo)} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">✏️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER EDUCATIVO */}
        <footer className="mt-20 text-center">
           <div className="bg-gradient-to-r from-transparent via-white/5 to-transparent h-px w-full mb-8" />
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Economía del Rendimiento: Acceso sobre Propiedad [cite: 2026-03-01].
           </p>
        </footer>

      </div>
    </div>
  );
}