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
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans overflow-x-hidden">
      
      {/* HERO SECTION RESPONSIVO */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Fondo con Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-30 md:opacity-40"
            alt="Impacto Ambiental"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className="max-w-4xl">
            {/* Título con escala de fuente fluida */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] uppercase tracking-tighter italic mb-6">
              RESERVA.<br />
              <span className="text-[#00D084]">NO COMPRES.</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-300 font-bold max-w-xl mb-10 leading-tight">
              Accede a herramientas y espacios premium cerca de ti, solo cuando los necesites. 
              <span className="text-green-400 block mt-2">ShareHub: Maximizando activos.</span>
            </p>

            {/* BOTONES: Se apilan en móvil, fila en desktop */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <button 
                onClick={() => navigate('/catalog')} 
                className="w-full sm:w-auto bg-[#B7FF2A] text-black px-10 py-4 rounded-full font-black uppercase text-sm md:text-base hover:scale-105 transition-all shadow-xl active:scale-95"
              >
                Reservar Ahora
              </button>
              <button 
                onClick={() => navigate('/catalog')} 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full font-black uppercase text-sm md:text-base hover:bg-white/20 transition-all"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN JOYAS / POPULARES */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 -mt-10 md:-mt-20 relative z-20 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-[10px] md:text-xs font-black text-green-400 uppercase tracking-[0.4em] mb-2">Comunidad Circular</h2>
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">Joyas del Acceso <br className="md:hidden" /> Circular</h3>
          </div>
          <Link to="/catalog" className="group flex items-center gap-2 text-white font-black text-[10px] md:text-xs uppercase tracking-widest border-b-2 border-green-500 pb-1 hover:text-green-400 transition-colors">
            Ver Todo <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* GRILLA DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentItems.length > 0 ? (
            recentItems.map(item => (
              <div key={item.id_activo} className="group bg-[#161B28] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-green-500/50 transition-all duration-500 shadow-2xl">
                {/* Imagen del Producto */}
                <div className="aspect-[4/5] bg-slate-800 relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80&w=800`} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                    alt={item.nombre_articulo}
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                     <p className="text-[9px] font-black text-green-400">-{ (item.peso_kg * 2.5).toFixed(1) }kg CO2</p>
                  </div>
                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B28] to-transparent"></div>
                </div>

                {/* Contenido Card */}
                <div className="p-8 -mt-8 relative z-10">
                  <div className="mb-4">
                    <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none mb-1 truncate">
                      {item.nombre_articulo}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      {item.categories?.nombre_categoria || 'Activo Circular'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Costo Acceso</p>
                      <p className="text-2xl font-black italic tracking-tighter">
                        ${item.precio_dia}<span className="text-xs font-normal text-slate-500">/día</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/catalog')} 
                      className="bg-[#B7FF2A] text-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-90"
                    >
                      <span className="text-xl font-bold">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Placeholder si no hay datos
            [1,2,3,4].map(i => (
              <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-[2.5rem]"></div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}