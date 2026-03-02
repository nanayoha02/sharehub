import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Star, Package, MapPin, Edit3, Eye, EyeOff, X, Upload } from 'lucide-react';

export default function Garage() {
  const [misActivos, setMisActivos] = useState([]);
  const [whatsapp, setWhatsapp] = useState(localStorage.getItem('user_wa') || '');
  const [waGuardado, setWaGuardado] = useState(!!localStorage.getItem('user_wa'));
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [categorias, setCategorias] = useState([]);

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

  // Cargar categorías reales de la base de datos para asegurar que aparezcan todas
  useEffect(() => {
    async function fetchCategorias() {
      const { data } = await supabase.from('categories').select('*').order('id_categoria');
      if (data) setCategorias(data);
    }
    fetchCategorias();
  }, []);

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
      const { data, error } = await supabase
        .from('assets')
        .select(`*, ratings (puntuacion, comentario)`)
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

  const guardarWhatsapp = () => {
    const numeroLimpio = whatsapp.replace(/\D/g, '');
    if (numeroLimpio.length < 8) return alert("Ingresa un número válido.");
    localStorage.setItem('user_wa', numeroLimpio);
    setWaGuardado(true);
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

        const { data: urlData } = supabase.storage.from('assets-images').getPublicUrl(fileName);
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
      fetchMisActivos();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 md:p-8 pb-32 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              Mi <span className="text-green-500 text-glow">Garage</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">Panel de Control de Economía Circular [2026]</p>
          </div>
          
          <div className={`p-6 rounded-[2rem] border transition-all ${waGuardado ? 'bg-green-500/5 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20 shadow-lg shadow-amber-900/10'}`}>
            <label className="block text-[9px] font-black uppercase text-slate-500 mb-2 ml-1">WhatsApp Vinculado</label>
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                value={whatsapp} 
                onChange={(e) => { setWhatsapp(e.target.value); setWaGuardado(false); }} 
                className="bg-transparent text-lg font-black border-none focus:ring-0 p-0 text-white w-36 tracking-wider" 
                placeholder="5076XXX..." 
              />
              <button onClick={guardarWhatsapp} className="bg-white text-black px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase hover:bg-green-500 transition-all active:scale-95">Vincular</button>
            </div>
          </div>
        </header>

        {!waGuardado ? (
          <div className="text-center py-32 bg-[#161B28]/30 rounded-[3rem] border border-dashed border-white/10">
            <Package size={48} className="mx-auto mb-6 text-slate-700" />
            <h3 className="text-xl font-black uppercase italic text-slate-500">Vincula tu número para gestionar activos</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* FORMULARIO */}
            <div className="lg:col-span-4">
              {!showForm ? (
                <button onClick={() => { setIsEditing(null); setShowForm(true); }} className="w-full py-24 border-2 border-dashed border-white/5 rounded-[3rem] hover:border-green-500/40 hover:bg-green-500/5 transition-all flex flex-col items-center gap-6 group relative overflow-hidden">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Package className="text-green-500" size={32} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Publicar nuevo activo</span>
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[#161B28] border border-white/5 p-10 rounded-[3rem] sticky top-10 shadow-2xl">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black uppercase italic text-2xl tracking-tighter">{isEditing ? 'Editar' : 'Nuevo'} <span className="text-green-500">Activo</span></h3>
                    <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
                  </div>
                  
                  <div className="space-y-5">
                    <input required value={formData.nombre_articulo} onChange={(e) => setFormData({...formData, nombre_articulo: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-5 rounded-2xl text-sm focus:border-green-500/30 outline-none" placeholder="Nombre del artículo" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0B0F19] p-4 rounded-2xl border border-white/5">
                        <label className="text-[9px] font-black uppercase text-slate-600 block mb-1">Precio / Día</label>
                        <input type="number" required value={formData.precio_dia} onChange={(e) => setFormData({...formData, precio_dia: e.target.value})} className="bg-transparent w-full text-lg font-black focus:outline-none" placeholder="$0.00" />
                      </div>
                      <div className="bg-[#0B0F19] p-4 rounded-2xl border border-white/5">
                        <label className="text-[9px] font-black uppercase text-slate-600 block mb-1">Peso (kg)</label>
                        <input type="number" required value={formData.peso_kg} onChange={(e) => setFormData({...formData, peso_kg: e.target.value})} className="bg-transparent w-full text-lg font-black focus:outline-none" placeholder="0.0" />
                      </div>
                    </div>

                    <input required value={formData.ubicacion_texto} onChange={(e) => setFormData({...formData, ubicacion_texto: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-5 rounded-2xl text-sm focus:border-green-500/30 outline-none" placeholder="Ciudad / Zona" />
                    
                    <div className="relative group">
                      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="w-full bg-[#0B0F19] border border-dashed border-white/10 p-5 rounded-2xl text-xs flex items-center justify-center gap-3 cursor-pointer group-hover:border-green-500/30 transition-all">
                        <Upload size={16} className="text-green-500"/>
                        <span className="font-bold text-slate-400 uppercase tracking-tighter">{file ? file.name : "Subir Foto del Producto"}</span>
                      </label>
                    </div>

                    <select value={formData.id_categoria} onChange={(e) => setFormData({...formData, id_categoria: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-5 rounded-2xl text-sm font-bold uppercase tracking-widest appearance-none cursor-pointer focus:border-green-500/30 outline-none">
                      {categorias.map(cat => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" disabled={uploading} className="w-full bg-green-500 text-black py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] mt-10 hover:bg-[#B7FF2A] transition-all shadow-xl shadow-green-500/10 active:scale-95">
                    {uploading ? "Sincronizando..." : isEditing ? "Actualizar Activo" : "Activar Activo"}
                  </button>
                </form>
              )}
            </div>

            {/* LISTADO */}
            <div className="lg:col-span-8 space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 mb-4 ml-4">Inventario Digital en Red</h3>
              
              {loading ? (
                <div className="text-center py-20 animate-pulse text-green-500 font-black uppercase text-[10px] tracking-widest">Descifrando activos...</div>
              ) : misActivos.map(activo => (
                <div key={activo.id_activo} className={`bg-[#161B28] rounded-[3rem] p-8 border transition-all duration-500 ${activo.disponible ? 'border-white/5 hover:border-green-500/20' : 'opacity-40 grayscale border-red-900/10'}`}>
                  <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-44 h-44 rounded-[2rem] overflow-hidden bg-[#0B0F19] shrink-0 border border-white/5 relative shadow-2xl">
                      {activo.foto_principal ? (
                        <img src={activo.foto_principal} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 italic font-black">N/A</div>
                      )}
                      {!activo.disponible && <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center font-black uppercase text-[10px] tracking-tighter">Fuera de Red</div>}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-3xl md:text-4xl uppercase italic tracking-tighter leading-none mb-3">{activo.nombre_articulo}</h4>
                          <div className="flex flex-wrap items-center gap-6 text-slate-500">
                             <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><MapPin size={12} className="text-green-500"/> {activo.ubicacion_texto}</span>
                             <span className="text-green-500 font-black text-[12px] uppercase bg-green-500/10 px-4 py-1.5 rounded-full tracking-tighter">${activo.precio_dia}/Día</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button onClick={() => {/* logic */}} className="p-4 bg-[#0B0F19] rounded-2xl hover:bg-white/5 transition-all"><Edit3 size={18} /></button>
                          <button onClick={() => {/* logic */}} className="p-4 bg-[#0B0F19] rounded-2xl hover:bg-white/5 transition-all text-green-500"><Eye size={18} /></button>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="text-[9px] font-black uppercase text-slate-600 mb-5 tracking-[0.2em] italic">— Feedback de la Red Circular</p>
                        <div className="flex flex-wrap gap-4">
                          {activo.ratings?.length > 0 ? (
                            activo.ratings.slice(0, 3).map((r, idx) => (
                              <div key={idx} className="bg-black/30 p-4 rounded-2xl border border-white/5 min-w-[160px]">
                                <div className="flex gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill={s <= r.puntuacion ? "#22c55e" : "transparent"} className={s <= r.puntuacion ? "text-green-500" : "text-slate-800"} />)}
                                </div>
                                <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed truncate">"{r.comentario}"</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-slate-700 font-black uppercase tracking-tighter">Sin valoraciones históricas</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}