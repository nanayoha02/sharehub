import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Star, Package, MapPin, Trash2, Edit3, Eye, EyeOff } from 'lucide-react';

export default function Garage() {
  const [misActivos, setMisActivos] = useState([]);
  const [whatsapp, setWhatsapp] = useState(localStorage.getItem('user_wa') || '');
  const [waGuardado, setWaGuardado] = useState(!!localStorage.getItem('user_wa'));
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    nombre_articulo: '',
    id_categoria: 1,
    descripcion: '',
    estado: 'Excelente',
    precio_dia: '',
    peso_kg: '',
    ubicacion_texto: '',
    foto_principal: ''
  });

  useEffect(() => {
    if (waGuardado && whatsapp) {
      fetchMisActivos();
    } else {
      setLoading(false);
    }
  }, [waGuardado]);

  async function fetchMisActivos() {
    try {
      setLoading(true);
      // Traemos activos y también sus ratings para que el dueño vea su reputación
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          ratings (puntuacion, comentario, usuario_email)
        `)
        .eq('telefono_contacto', whatsapp)
        .order('id_activo', { ascending: false });

      if (error) throw error;
      setMisActivos(data || []);
    } catch (error) {
      console.error("Error:", error.message);
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
      ubicacion_texto: activo.ubicacion_texto,
      foto_principal: activo.foto_principal || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let publicUrl = formData.foto_principal;

      if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('assets-images') 
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('assets-images')
          .getPublicUrl(fileName);
        
        publicUrl = urlData.publicUrl;
      }

      const assetPayload = {
        ...formData,
        precio_dia: parseFloat(formData.precio_dia),
        peso_kg: parseFloat(formData.peso_kg),
        id_categoria: parseInt(formData.id_categoria),
        foto_principal: publicUrl,
        telefono_contacto: whatsapp,
      };

      if (isEditing) {
        const { error } = await supabase.from('assets').update(assetPayload).eq('id_activo', isEditing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('assets').insert([{ ...assetPayload, disponible: true }]);
        if (error) throw error;
      }

      setShowForm(false);
      setIsEditing(null);
      setFile(null);
      fetchMisActivos();
      alert("Inventario actualizado correctamente");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 md:p-8 pb-32">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER GESTIÓN */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
              Mi <span className="text-green-500">Garage</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[9px] mt-2">Panel de Control de Economía Circular</p>
          </div>
          
          <div className={`p-4 rounded-2xl border transition-all ${waGuardado ? 'bg-green-500/5 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <label className="block text-[8px] font-black uppercase text-slate-500 mb-1">WhatsApp de Contacto</label>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={whatsapp} 
                onChange={(e) => { setWhatsapp(e.target.value); setWaGuardado(false); }} 
                className="bg-transparent text-sm font-bold border-none focus:ring-0 p-0 text-white w-32" 
                placeholder="Ej: 50760001111" 
              />
              <button onClick={guardarWhatsapp} className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-green-500 transition-colors">Vincular</button>
            </div>
          </div>
        </header>

        {waGuardado && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* COLUMNA IZQUIERDA: FORMULARIO */}
            <div className="lg:col-span-1">
              {!showForm ? (
                <button onClick={() => { setIsEditing(null); setShowForm(true); }} className="w-full py-20 border-2 border-dashed border-white/10 rounded-[2.5rem] hover:border-green-500/50 hover:bg-green-500/5 transition-all flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="text-green-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publicar nuevo activo</span>
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[#161B28] border border-white/10 p-8 rounded-[2.5rem] sticky top-8 animate-in slide-in-from-bottom-4 duration-500">
                  <h3 className="font-black uppercase italic mb-6 text-xl">{isEditing ? 'Editar Activo' : 'Nuevo Activo'}</h3>
                  
                  <div className="space-y-4">
                    <input required value={formData.nombre_articulo} onChange={(e) => setFormData({...formData, nombre_articulo: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-4 rounded-2xl text-sm" placeholder="Nombre del artículo" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase ml-2 text-slate-500">Precio / Día</label>
                        <input type="number" required value={formData.precio_dia} onChange={(e) => setFormData({...formData, precio_dia: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-4 rounded-2xl text-sm" placeholder="$" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase ml-2 text-slate-500">Peso (kg)</label>
                        <input type="number" required value={formData.peso_kg} onChange={(e) => setFormData({...formData, peso_kg: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-4 rounded-2xl text-sm" placeholder="kg" />
                      </div>
                    </div>

                    <input required value={formData.ubicacion_texto} onChange={(e) => setFormData({...formData, ubicacion_texto: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-4 rounded-2xl text-sm" placeholder="Ciudad / Zona" />
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase ml-2 text-slate-500">Foto del producto</label>
                      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full bg-[#0B0F19] border border-white/5 p-3 rounded-2xl text-[10px] file:bg-green-500 file:border-none file:rounded-lg file:text-black file:font-black file:uppercase file:text-[8px] file:px-3" />
                    </div>

                    <select value={formData.id_categoria} onChange={(e) => setFormData({...formData, id_categoria: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-4 rounded-2xl text-sm appearance-none">
                      <option value="1">Herramientas</option>
                      <option value="2">Camping</option>
                      <option value="3">Electrónica</option>
                      <option value="4">Hogar</option>
                      <option value="5">Deportes</option>
                    </select>
                  </div>

                  <div className="flex gap-2 mt-8">
                    <button type="submit" disabled={uploading} className="flex-grow bg-green-500 text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#B7FF2A] transition-all">
                      {uploading ? "Procesando..." : "Guardar Cambios"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-white/5 rounded-2xl font-black uppercase text-[10px]">X</button>
                  </div>
                </form>
              )}
            </div>

            {/* COLUMNA DERECHA: LISTADO */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 ml-4">Tus Activos Publicados</h3>
              
              {loading ? (
                <div className="text-center py-20 animate-pulse text-green-500 font-black uppercase text-[10px]">Cargando Inventario...</div>
              ) : misActivos.length === 0 ? (
                <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] py-20 text-center">
                  <p className="text-slate-500 font-bold uppercase text-[10px]">No tienes activos registrados aún.</p>
                </div>
              ) : (
                misActivos.map(activo => (
                  <div key={activo.id_activo} className={`bg-[#161B28] rounded-[2.5rem] p-6 border transition-all ${activo.disponible ? 'border-white/5' : 'opacity-50 grayscale border-red-900/20'}`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Miniatura */}
                      <div className="w-full md:w-32 h-32 rounded-[1.5rem] overflow-hidden bg-[#0B0F19] shrink-0 border border-white/5">
                        {activo.foto_principal ? (
                          <img src={activo.foto_principal} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>

                      {/* Info Principal */}
                      <div className="flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-black text-2xl uppercase italic tracking-tighter">{activo.nombre_articulo}</h4>
                            <div className="flex items-center gap-3 text-slate-500">
                               <span className="flex items-center gap-1 text-[9px] font-bold uppercase"><MapPin size={10} /> {activo.ubicacion_texto}</span>
                               <span className="text-green-500 font-black text-[9px] uppercase">${activo.precio_dia}/Día</span>
                            </div>
                          </div>
                          
                          {/* Acciones Rápidas */}
                          <div className="flex gap-2">
                            <button onClick={() => toggleDisponibilidad(activo.id_activo, activo.disponible)} className="p-3 bg-[#0B0F19] rounded-xl hover:bg-white/10 transition-colors">
                              {activo.disponible ? <Eye size={16} /> : <EyeOff size={16} className="text-red-500" />}
                            </button>
                            <button onClick={() => iniciarEdicion(activo)} className="p-3 bg-[#0B0F19] rounded-xl hover:bg-white/10 transition-colors">
                              <Edit3 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* SECCIÓN DE RATINGS PARA EL DUEÑO */}
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="text-[8px] font-black uppercase text-slate-600 mb-3 tracking-widest italic">Feedback de la Red Circular</p>
                          <div className="flex flex-wrap gap-4">
                            {activo.ratings?.length > 0 ? (
                              activo.ratings.slice(0, 3).map((r, idx) => (
                                <div key={idx} className="bg-black/20 p-3 rounded-xl border border-white/5 max-w-[150px]">
                                  <div className="flex gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                      <Star key={s} size={8} fill={s <= r.puntuacion ? "#eab308" : "transparent"} className={s <= r.puntuacion ? "text-yellow-500" : "text-slate-800"} />
                                    ))}
                                  </div>
                                  <p className="text-[9px] text-slate-400 italic leading-tight truncate">"{r.comentario || 'Sin comentario'}"</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-[9px] text-slate-700 font-bold uppercase tracking-tight">Sin valoraciones todavía</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}