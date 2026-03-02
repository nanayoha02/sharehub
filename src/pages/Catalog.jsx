import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Star } from 'lucide-react'; // Necesitas instalar lucide-react

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState(['Todos']);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [loading, setLoading] = useState(true);
  
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const searchTerm = queryParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    fetchData();
  }, [search]); 

  async function fetchData() {
    try {
      setLoading(true);
      
      // Traemos activos con sus categorías y el promedio de sus ratings
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select(`
          *,
          categories (nombre_categoria),
          ratings (puntuacion)
        `)
        .eq('disponible', true) 
        .order('id_activo', { ascending: false });

      const { data: catData } = await supabase.from('categories').select('nombre_categoria');

      if (assetsError) throw assetsError;

      // Procesar datos para calcular el promedio de estrellas localmente
      const itemsWithRatings = assetsData.map(item => {
        const totalRatings = item.ratings?.length || 0;
        const promedio = totalRatings > 0 
          ? item.ratings.reduce((acc, curr) => acc + curr.puntuacion, 0) / totalRatings 
          : 0;
        return { ...item, promedio, totalRatings };
      });

      setItems(itemsWithRatings || []);
      if (catData) setCategorias(['Todos', ...catData.map(c => c.nombre_categoria)]);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = items.filter(item => {
    const cumpleBusqueda = item.nombre_articulo?.toLowerCase().includes(searchTerm);
    const cumpleCategoria = categoriaSeleccionada === 'Todos' || 
                            item.categories?.nombre_categoria === categoriaSeleccionada;
    return cumpleBusqueda && cumpleCategoria;
  });

  // Sub-componente interno para las estrellas
  const RatingStars = ({ valor, total }) => (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s} 
            size={12} 
            fill={s <= Math.round(valor) ? "#eab308" : "transparent"} 
            className={s <= Math.round(valor) ? "text-yellow-500" : "text-slate-600"}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-slate-500">({total})</span>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="text-center font-black text-green-500 animate-pulse uppercase tracking-widest text-xs">
        Sincronizando Marketplace...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-4 md:px-8 py-8 pb-32 overflow-x-hidden">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
        
        {/* HEADER */}
        <header className="mb-10 md:mb-16 pt-6 md:pt-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="w-full lg:max-w-2xl">
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter italic uppercase leading-[0.9] mb-6 break-words">
                Marketplace <br /><span className="text-green-500 text-2xl sm:text-4xl">de Acceso</span>
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px] leading-relaxed max-w-md">
                Virtualize: Sustituyendo la propiedad por el acceso digital para combatir la crisis ambiental.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md w-full sm:w-fit">
              <p className="text-[9px] font-black text-green-400 uppercase mb-1">Impacto Total de la Red</p>
              <p className="text-xl md:text-2xl font-black tracking-tighter">ODS 12 & 13</p>
            </div>
          </div>
        </header>

        {/* CATEGORÍAS */}
        <div className="flex flex-nowrap overflow-x-auto md:flex-wrap gap-2 md:gap-3 mb-10 md:mb-16 border-b border-white/5 pb-6 no-scrollbar">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shrink-0 ${
                categoriaSeleccionada === cat 
                ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' 
                : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id_activo} className="group bg-[#161B28] rounded-[2rem] overflow-hidden border border-white/5 hover:border-green-500/50 transition-all duration-500 flex flex-col">
                
                {/* IMAGEN */}
                <div className="aspect-square sm:aspect-[4/3] bg-slate-800 relative overflow-hidden">
                  {item.foto_principal ? (
                    <img 
                      src={item.foto_principal} 
                      alt={item.nombre_articulo} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">📦</div>
                  )}
                  
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl z-20">
                    <p className="text-[8px] font-black text-green-400 uppercase">Huella Evitada</p>
                    <p className="text-[10px] font-bold">-{ (item.peso_kg * 2.5).toFixed(1) }kg CO2</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B28] via-transparent to-transparent opacity-60"></div>
                </div>

                {/* CONTENIDO */}
                <div className="p-6 md:p-8 -mt-10 relative z-10 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-green-500/10 text-green-400 text-[8px] font-black px-2 py-1 rounded-full uppercase border border-green-500/20 inline-block">
                      {item.categories?.nombre_categoria || 'Activo Circular'}
                    </span>
                    <RatingStars valor={item.promedio} total={item.totalRatings} />
                  </div>

                  <h4 className="font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none mb-2 truncate">
                    {item.nombre_articulo}
                  </h4>
                  <p className="text-slate-500 text-[9px] font-bold uppercase mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {item.ubicacion_texto || 'Panamá'}
                  </p>

                  <div className="flex items-center justify-between mt-auto mb-8 border-y border-white/5 py-4">
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Tarifa</p>
                      <p className="text-3xl font-black italic tracking-tighter">${item.precio_dia}<span className="text-xs font-normal text-slate-500">/día</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Status</p>
                       <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Disponible</p>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/${item.telefono_contacto?.replace(/\D/g, '')}?text=Hola, me interesa alquilar: ${item.nombre_articulo}`} 
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 transition-all active:scale-95"
                  >
                    Solicitar Acceso ⚡
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
              <p className="text-slate-500 font-bold uppercase text-xs">Sin activos disponibles en esta categoría.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}