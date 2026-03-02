import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Star, Package, MapPin, Edit3, Eye, EyeOff, X, Upload, Plus } from 'lucide-react';

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

  // CARGA DINÁMICA DE CATEGORÍAS (Hogar, Deportes, etc.)
  useEffect(() => {
    async function fetchCategorias() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('id_categoria', { ascending: true });
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
    fetchMisActivos();
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
      setFile(null);
      fetchMisActivos();
      alert("Inventario Sincronizado");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 md:p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER ESTILO RED CIRCULAR */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.8]">
              MI <span className="text-green-500">GARAGE</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">PANEL DE CONTROL DE ECONOMÍA CIRCULAR [2026]</p>
          </div>
          
          <div className={`p-5 rounded-[2rem] border transition-all ${waGuardado ? 'bg-green-500/5 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <label className="block text-[9px] font-black uppercase text-slate-500 mb-2 ml-1">WhatsApp de Contacto</label>
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                value={whatsapp} 
                onChange={(e) => { setWhatsapp(e.target.value); setWaGuardado(false); }} 
                className="bg-transparent text-lg font-black border-none focus:ring-0 p-0 text-white w-36 tracking-wider outline-none" 
                placeholder="507XXXXXXX" 
              />
              <button onClick={guardarWhatsapp} className="bg-white text-black px-6 py-2 rounded-2xl text-[10px] font-black uppercase hover:bg-green-500 transition-all active:scale-95">Vincular</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="lg:col-span-4">
            {!showForm ? (
              <button onClick={() => { setIsEditing(null); setShowForm(true); }} className="w-full py-24 border-2 border-dashed border-white/5 rounded-[3rem] hover:border-green-500/40 hover:bg-green-500/5 transition-all flex flex-col items-center gap-6 group">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Plus className="text-green-500" size={32} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Publicar nuevo activo</span>
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#161B28] border border-white/5 p-8 rounded-[3rem] sticky top-10 shadow-2xl animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black uppercase italic text-2xl tracking-tighter">{isEditing ? 'Editar' : 'Nuevo'} Activo</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                  <input required value={formData.nombre_articulo} onChange={(e) => setFormData({...formData, nombre_articulo: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-5 rounded-2xl text-sm outline-none focus:border-green-500/30" placeholder="Nombre del artículo" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-600 ml-4">Precio / Día</label>
                      <input type="number" required value={formData.precio_dia} onChange={(e) => setFormData({...formData, precio_dia: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-5 rounded-2xl text-sm outline-none focus:border-green-500/30" placeholder="$" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-600 ml-4">Peso (kg)</label>
                      <input type="number" required value={formData.peso_kg} onChange={(e) => setFormData({...formData, peso_kg: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-5 rounded-2xl text-sm outline-none focus:border-green-500/30" placeholder="kg" />
                    </div>
                  </div>

                  <input required value={formData.ubicacion_texto} onChange={(e) => setFormData({...formData, ubicacion_texto: e.target.value})} className="w-full bg-[#0B0F19] border border-white/5 p-5 rounded-2xl text-sm outline-none focus:border-green-500/30" placeholder="Ciudad / Zona" />
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 block mb-1">Foto del producto</label>
                    <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full bg-[#0B0F19] border border-white/5 p-4 rounded-2xl text-[10px] file:bg-green-500 file:border-none file:rounded-lg file:text-black file:font-black file:uppercase file:text-[8px] file:px-3 file:mr-4 cursor-pointer" />
                  </div>

                  {/* SELECT DINÁMICO DE CATEGORÍAS */}
                  <select 
                    value={formData.id_categoria} 
                    onChange={(e) => setFormData({...formData, id_categoria: e.target.value})} 
                    className="w-full bg-[#0B0F19] border border-white/5 p-5 rounded-2xl text-sm font-bold uppercase tracking-widest appearance-none cursor-pointer focus:border-green-500/30 outline-none"
                  >
                    {categorias.map(cat => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" disabled={uploading} className="w-full bg-green-500 text-black py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] mt-8 hover:bg-[#B7FF2A] transition-all shadow-xl shadow-green-500/10">
                  {uploading ? "SINCRONIZANDO..." : "GUARDAR CAMBIOS"}
                </button>
              </form>
            )}
          </div>

          {/* COLUMNA DERECHA: LISTADO DE ACTIVOS */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 mb-4 ml-4">INVENTARIO PUBLICADO</h3>
            
            {loading ? (
              <div className="text-center py-20 animate-pulse text-green-500 font-black uppercase text-[10px] tracking-widest">CONECTANDO A LA RED...</div>
            ) : misActivos.length === 0 ? (
              <div className="bg-white/5 border border-dashed border-white/10 rounded-[3rem] py-32 text-center">
                <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">No hay activos registrados bajo este número.</p>
              </div>
            ) : (
              misActivos.map(activo => (
                <div key={activo.id_activo} className={`bg-[#161B28] rounded-[3rem] p-8 border transition-all duration-500 ${activo.disponible ? 'border-white/5 hover:border-green-500/20' : 'opacity-40 grayscale border-red-900/10'}`}>
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Imagen con Aspecto Profesional */}
                    <div className="w-full md:w-40 h-40 rounded-[2rem] overflow-hidden bg-[#0B0F19] shrink-0 border border-white/5 shadow-inner">
                      {activo.foto_principal ? (
                        <img src={activo.foto_principal} className="w-full h-full object-cover" alt={activo.nombre_articulo} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl grayscale opacity-20 font-black italic">CIRCULAR</div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-3xl md:text-4xl uppercase italic tracking-tighter leading-none mb-2">{activo.nombre_articulo}</h4>
                          <div className="flex flex-wrap items-center gap-5 text-slate-500">
                             <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"><MapPin size={12} className="text-green-500"/> {activo.ubicacion_texto}</span>
                             <span className="text-green-500 font-black text-[12px] uppercase bg-green-500/10 px-4 py-1.5 rounded-full tracking-tighter">${activo.precio_dia}/DÍA</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button onClick={() => {/* Lógica editar */}} className="p-4 bg-[#0B0F19] rounded-2xl hover:bg-white/5 transition-all"><Edit3 size={18} /></button>
                          <button onClick={() => {/* Lógica disponibilidad */}} className="p-4 bg-[#0B0F19] rounded-2xl hover:bg-white/5 transition-all text-green-500"><Eye size={18} /></button>
                        </div>
                      </div>

                      {/* Feedback de Clientes */}
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <p className="text-[9px] font-black uppercase text-slate-700 mb-4 tracking-[0.2em] italic">— FEEDBACK DE LA RED CIRCULAR</p>
                        <div className="flex flex-wrap gap-4">
                          {activo.ratings?.length > 0 ? (
                            activo.ratings.slice(0, 2).map((r, idx) => (
                              <div key={idx} className="bg-black/30 p-4 rounded-2xl border border-white/5 min-w-[150px]">
                                <div className="flex gap-0.5 mb-2">
                                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill={s <= r.puntuacion ? "#22c55e" : "transparent"} className={s <= r.puntuacion ? "text-green-500" : "text-slate-800"} />)}
                                </div>
                                <p className="text-[10px] text-slate-400 italic font-medium leading-tight">"{r.comentario}"</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-slate-800 font-black uppercase tracking-tighter">Sin valoraciones históricas todavía</p>
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
      </div>
    </div>
  );
}