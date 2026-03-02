import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  Wrench, 
  Wind, 
  Tent, 
  Smartphone, 
  Home as HomeIcon, 
  Trophy, 
  Box 
} from 'lucide-react';

export default function Home() {
  const [recentItems, setRecentItems] = useState([]);
  const navigate = useNavigate();

  // Función para asignar un icono de respaldo si no hay imagen
  const getIcon = (nombre, categoria) => {
    const n = nombre.toLowerCase();
    const c = categoria?.toLowerCase() || '';

    if (n.includes('taladro') || c.includes('herramientas')) return <Wrench size={48} />;
    if (n.includes('abanico') || n.includes('aire')) return <Wind size={48} />;
    if (c.includes('camping')) return <Tent size={48} />;
    if (c.includes('electrónica')) return <Smartphone size={48} />;
    if (c.includes('hogar')) return <HomeIcon size={48} />;
    if (c.includes('deportes')) return <Trophy size={48} />;
    return <Box size={48} />;
  };

  useEffect(() => {
    async function fetchRecent() {
      const { data } = await supabase
        .from('assets')
        .select('*, categories(nombre_categoria)')
        .eq('disponible', true)
        .order('id_activo', { ascending: false })
        .limit(4);
      if (data) setRecentItems(data);
    }
    fetchRecent();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center p-6 md:p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=2070" 
            alt="Sustainability Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/60 to-transparent"></div>
        </div>

        <div className="max-w-5xl z-10 relative">
          <h1 className="text-6xl md:text-[120px] font-black leading-none italic tracking-tighter uppercase mb-6">
            RESERVA.<br/><span className="text-green-500">NO COMPRES.</span>
          </h1>
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={() => navigate('/catalog')} 
              className="bg-[#B7FF2A] text-black px-8 py-4 rounded-full font-black uppercase text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(183,255,42,0.3)]"
            >
              Explorar Catálogo
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN JOYAS CON IMÁGENES REALES */}
      <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-green-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Recién llegados</p>
            <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Joyas del Acceso</h3>
          </div>
          <button 
            onClick={() => navigate('/catalog')}
            className="text-slate-400 hover:text-white font-bold uppercase text-[10px] tracking-widest border-b border-white/10 pb-1"
          >
            Ver Todo
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentItems.map(item => (
            <div key={item.id_activo} className="bg-[#161B28] rounded-[2.5rem] p-4 border border-white/5 hover:border-green-500/30 transition-all group">
              
              {/* CONTENEDOR DE IMAGEN / ICONO */}
              <div className="aspect-square bg-[#1c2333] rounded-[2rem] flex items-center justify-center mb-6 relative overflow-hidden">
                {item.foto_principal ? (
                  <img 
                    src={item.foto_principal} 
                    alt={item.nombre_articulo} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-slate-700 group-hover:text-green-500/40 transition-colors">
                    {getIcon(item.nombre_articulo, item.categories?.nombre_categoria)}
                  </div>
                )}

                {/* Badge de CO2 Flotante */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 z-20">
                  <span className="text-[9px] font-black text-green-400">-{ (item.peso_kg * 2.5).toFixed(1) }kg CO2</span>
                </div>
                
                {/* Overlay degradado para fotos */}
                {item.foto_principal && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B28]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </div>

              {/* Info del Producto */}
              <div className="px-4 pb-4 space-y-4">
                <div>
                  <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-1">
                    {item.categories?.nombre_categoria || 'Activo'}
                  </p>
                  <h4 className="text-xl font-black uppercase tracking-tighter italic truncate">
                    {item.nombre_articulo}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    {item.ubicacion_texto || 'Panamá'}
                  </p>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase">Tarifa</p>
                    <p className="text-2xl font-black italic">${item.precio_dia}<span className="text-xs text-slate-500 font-normal">/día</span></p>
                  </div>
                  <button 
                    onClick={() => navigate('/catalog')}
                    className="bg-[#B7FF2A] text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                  >
                    <span className="font-bold text-lg">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer simple para el Home */}
      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-slate-600 font-black uppercase tracking-[0.5em] text-[10px]">Virtualize 2026 • Circular Economy</p>
      </footer>
    </div>
  );
}