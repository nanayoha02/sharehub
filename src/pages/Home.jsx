import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
// Importamos iconos de una librería como Lucide
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

  // Función para asignar un icono según el nombre o categoría
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
      
      {/* HERO SECTION - Con Imagen de Fondo de Economía Circular */}
      <section className="relative min-h-[85vh] flex items-center p-6 md:p-20 overflow-hidden">
        
        {/* Capa de Imagen de Fondo */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=2070" 
            alt="Sustainability Background" 
            className="w-full h-full object-cover opacity-30"
          />
          {/* Overlay Degradado para legibilidad */}
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
              Reservar Ahora
            </button>
            <button 
              onClick={() => navigate('/catalog')} 
              className="bg-white/5 border border-white/10 backdrop-blur-md px-8 py-4 rounded-full font-black uppercase text-sm hover:bg-white/10 transition-all"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN JOYAS CON ICONOS */}
      <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <h3 className="text-3xl font-black uppercase italic mb-12">Joyas del Acceso Circular</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentItems.map(item => (
            <div key={item.id_activo} className="bg-[#161B28] rounded-[2rem] p-8 border border-white/5 hover:border-green-500/30 transition-all group">
              
              {/* Contenedor del Icono */}
              <div className="aspect-square bg-[#1c2333] rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden">
                <div className="text-slate-700 group-hover:text-green-500/40 transition-colors">
                  {getIcon(item.nombre_articulo, item.categories?.nombre_categoria)}
                </div>
                {/* Badge de CO2 */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[10px] font-black text-green-400">-{ (item.peso_kg * 2.5).toFixed(1) }kg CO2</span>
                </div>
              </div>

              {/* Info del Producto */}
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">
                    {item.categories?.nombre_categoria || 'Activo'}
                  </p>
                  <h4 className="text-2xl font-black uppercase tracking-tighter italic truncate">
                    {item.nombre_articulo}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">📍 {item.ubicacion_texto || 'Panamá'}</p>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase">Tarifa</p>
                    <p className="text-2xl font-black">${item.precio_dia}<span className="text-xs text-slate-500 font-normal">/día</span></p>
                  </div>
                  <button className="bg-[#B7FF2A] text-black p-3 rounded-full hover:bg-white transition-colors">
                    <span className="font-bold text-xl">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}