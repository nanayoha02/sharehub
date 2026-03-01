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
      <section className="relative min-h-[90vh] md:h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20 md:opacity-40"
            alt="Impacto Ambiental"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full py-12 md:py-0">
          <div className="max-w-3xl space-y-6 md:space-y-8">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] uppercase tracking-tighter break-words">
              RESERVA.<br />
              <span className="text-[#00D084]">NO COMPRES.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 font-medium max-w-xl">
              Accede a herramientas y espacios premium cerca de ti, solo cuando los necesites.
              <br className="hidden md:block" />
              <span className="text-green-400 font-bold italic block mt-2 md:inline">ShareHub: Maximizando activos.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate('/catalog')} 
                className="w-full sm:w-auto bg-[#B7FF2A] text-black px-10 py-4 rounded-full font-black uppercase text-base md:text-lg hover:scale-105 transition-all shadow-lg active:scale-95"
              >
                Reservar Ahora
              </button>
              <button 
                onClick={() => navigate('/catalog')} 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full font-black uppercase text-base md:text-lg hover:bg-white/20 transition-all"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN POPULARES */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 md:-mt-20 relative z-20 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-[10px] font-black text-green-400 uppercase tracking-[0.4em] mb-2">Comunidad Circular</h2>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">Joyas del Acceso Circular</h3>
          </div>
          <Link to="/catalog" className="text-white font-bold border-b-2 border-green-500 pb-1 text-xs uppercase tracking-widest hover:text-green-400 transition-colors">
            Ver Todo →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentItems.map(item => (
            <div key={item.id_activo} className="group bg-[#161B28] rounded-[2rem] overflow-hidden border border-white/5 hover:border-green-500/50 transition-all duration-500 shadow-2xl">
              <div className="aspect-[4/5] bg-slate-800 relative overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80&w=800`} 
                  className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" 
                  alt={item.nombre_articulo}
                />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                   <p className="text-[9px] font-black text-green-400">-{ (item.peso_kg * 2.5).toFixed(1) }kg CO2</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-lg md:text-xl font-black uppercase tracking-tight truncate">{item.nombre_articulo}</h4>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.categories?.nombre_categoria || 'Activo'}</p>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <p className="text-2xl font-black">${item.precio_dia}<span className="text-xs font-normal text-slate-500 italic">/día</span></p>
                  <button onClick={() => navigate('/catalog')} className="bg-[#B7FF2A] text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-all">
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