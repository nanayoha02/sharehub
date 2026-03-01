import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Home() {
  const [recentItems, setRecentItems] = useState([]);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans">
      {/* HERO SECTION: INSPIRADO EN TUS REFERENCIAS */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        {/* Imagen de fondo real para dar contexto ambiental y de uso */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40"
            alt="Fondo de impacto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-7xl md:text-8xl font-black leading-[0.85] uppercase tracking-tighter">
              RESERVA.<br />
              <span className="text-[#00D084]">NO COMPRES.</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium">
              Accede a herramientas y espacios premium cerca de ti, solo cuando los necesites.
              <br />
              <span className="text-green-400 font-bold italic">ShareHub: Maximizando activos, minimizando desperdicios.</span>
            </p>
            <div className="flex gap-4 pt-4">
              <button onClick={() => navigate('/Catalog')} className="bg-[#B7FF2A] text-black px-10 py-4 rounded-full font-black uppercase text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(183,255,42,0.4)]">
                Reservar Ahora
              </button>
              <button onClick={() => navigate('/Catalog')} className="bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full font-black uppercase text-lg hover:bg-white/20 transition-all">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN POPULARES: ESTILO NETFLIX / TECH */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xs font-black text-green-400 uppercase tracking-[0.4em] mb-2">Favoritos de la Comunidad</h2>
            <h3 className="text-3xl font-black uppercase tracking-tighter italic">Joyas de la Economía Circular</h3>
          </div>
          <Link to="/Catalog" className="text-white font-bold border-b-2 border-green-500 pb-1 text-sm uppercase tracking-widest hover:text-green-400 transition-colors">
            Ver Todo →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {recentItems.map(item => (
            <div key={item.id_activo} className="group bg-[#161B28] rounded-3xl overflow-hidden border border-white/5 hover:border-green-500/50 transition-all duration-500 shadow-2xl">
              {/* Imagen del Activo */}
              <div className="aspect-[4/5] bg-slate-800 relative overflow-hidden">
                <img 
                  src={`https://source.unsplash.com/featured/?${item.nombre_articulo}`} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                  alt={item.nombre_articulo}
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                   <p className="text-[10px] font-black text-green-400">-{ (item.peso_kg * 2.5).toFixed(1) }kg CO2</p>
                </div>
              </div>

              {/* Contenido de la Card */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tight truncate">{item.nombre_articulo}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.categories?.nombre_categoria}</p>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <p className="text-2xl font-black">${item.precio_dia}<span className="text-[10px] font-normal text-slate-500 italic">/día</span></p>
                  <button onClick={() => navigate('/Catalog')} className="bg-[#B7FF2A] text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    →
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