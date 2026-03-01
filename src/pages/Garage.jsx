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
        .eq('id_activo', id);

      if (error) throw error;
      setMisActivos(prev => prev.map(a => 
        a.id_activo === id ? { ...a, disponible: !estadoActual } : a
      ));
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const guardarWhatsapp = () => {
    const numeroLimpio = whatsapp.replace(/\D/g, '');
    if (numeroLimpio.length < 8) return alert("Ingresa un número válido.");
    setWhatsapp(numeroLimpio);
    localStorage.setItem('user_wa', numeroLimpio);
    setWaGuardado(true);
  };

  const iniciarEdicion = (activo) => {
    setIsEditing(activo.id_activo);
    setFormData({
      nombre_articulo: activo.nombre_articulo,
      id_categoria: activo.id_categoria,
      descripcion: activo.descripcion || '',
      estado: activo.estado || 'Excelente',
      precio_dia: activo.precio_dia,
      peso_kg: activo.peso_kg,
      ubicacion_texto: activo.ubicacion_texto
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 md:p-8 pb-32 font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        {/* HEADER RESPONSIVO */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="w-full md:w-auto">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
              Mi <span className="text-green-500">Garage</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] mt-4 max-w-xs">
              ShareHub: Maximizando Activos, Minimizando Desperdicios.
            </p>
          </div>
          
          {/* Card de ID Vinculada optimizada para móvil */}
          <div className={`w-full md:w-auto p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${waGuardado ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <div className="flex-grow">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{waGuardado ? "ID VINCULADA" : "ID REQUERIDA"}</p>
              <input 
                type="text" 
                value={whatsapp} 
                onChange={(e) => { setWhatsapp(e.target.value); setWaGuardado(false); }} 
                className="bg-transparent text-sm font-bold border-none focus:ring-0 p-0 text-white w-full md:w-28" 
                placeholder="Tu WhatsApp" 
              />
            </div>
            <button onClick={guardarWhatsapp} className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-green-500 transition-colors shrink-0">
              Vincular
            </button>
          </div>
        </header>

        {waGuardado && (
          <div className="space-y-8">
            {/* BOTÓN O FORMULARIO DE AÑADIR */}
            {!showForm ? (
              <button 
                onClick={() => { setIsEditing(null); setShowForm(true); }} 
                className="group w-full py-10 md:py-14 border-2 border-dashed border-white/10 rounded-[2rem] md:rounded-[3rem] hover:border-green-500/50 hover:bg-green-500/5 transition-all flex flex-col items-center justify-center gap-4"
              >
                <span className="text-4xl group-hover:scale-125 transition-transform">➕</span>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-green-500">Virtualizar Nuevo Activo</span>
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black uppercase italic">{isEditing ? 'Editar Activo' : 'Nuevo Activo'}</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest">Cancelar</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nombre del Activo</label>
                    <input required value={formData.nombre_articulo} onChange={(e) => setFormData({...formData, nombre_articulo: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all" placeholder="Ej. Sierra Eléctrica" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Precio/Día</label>
                      <input type="number" required value={formData.precio_dia} onChange={(e) => setFormData({...formData, precio_dia: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none" placeholder="$" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Peso (kg)</label>
                      <input type="number" required value={formData.peso_kg} onChange={(e) => setFormData({...formData, peso_kg: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none" placeholder="kg" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Ubicación de Recogida</label>
                    <input required value={formData.ubicacion_texto} onChange={(e) => setFormData({...formData, ubicacion_texto: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none" placeholder="Ej. La Chorrera, Centro" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest mt-8 transition-all shadow-lg active:scale-95">
                  {isEditing ? "Actualizar Activo" : "Subir al Sistema"}
                </button>
              </form>
            )}

            {/* LISTADO DE ACTIVOS RESPONSIVO */}
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {loading ? (
                <div className="py-20 text-center animate-pulse font-black text-slate-500 uppercase tracking-widest text-xs">Sincronizando...</div>
              ) : misActivos.map(activo => (
                <div key={activo.id_activo} className={`group p-6 md:p-8 rounded-[2rem] border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${activo.disponible ? 'bg-white/5 border-white/10' : 'bg-black/40 border-white/5 opacity-60 grayscale'}`}>
                  <div className="w-full md:flex-grow">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-black text-xl md:text-2xl uppercase italic tracking-tighter">{activo.nombre_articulo}</h4>
                      <span className={`text-[7px] md:text-[8px] font-black px-3 py-1 rounded-full tracking-widest shrink-0 ${activo.disponible ? 'bg-green-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
                        {activo.disponible ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px] md:text-[11px] mt-2 font-medium tracking-tight uppercase flex items-center flex-wrap gap-2">
                      📍 {activo.ubicacion_texto} <span className="hidden xs:inline text-white/10">|</span> <span className="text-green-500">🍃 CO2: -{(activo.peso_kg * 3).toFixed(1)}kg</span>
                    </p>
                  </div>
                  
                  <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 border-t md:border-none border-white/5 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Renta/Día</p>
                      <p className="font-black text-2xl md:text-3xl italic">${activo.precio_dia}</p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleDisponibilidad(activo.id_activo, activo.disponible)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all border ${activo.disponible ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-slate-800 border-white/5 text-slate-500'}`}
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

        <footer className="mt-20 text-center pb-10">
           <div className="bg-gradient-to-r from-transparent via-white/5 to-transparent h-px w-full mb-8" />
           <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
             Economía del Rendimiento: Acceso sobre Propiedad.
           </p>
        </footer>
      </div>
    </div>
  );
}