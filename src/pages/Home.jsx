{/* GRILLA DE PRODUCTOS CON IMÁGENES DINÁMICAS */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {recentItems.length > 0 ? (
    recentItems.map(item => {
      // Función para generar la URL de la imagen según el nombre
      const searchQuery = encodeURIComponent(`${item.nombre_articulo} tool industrial`);
      const imageUrl = `https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800`; // Imagen de respaldo (fallback)
      const dynamicUrl = `https://source.unsplash.com/featured/800x1000?${searchQuery}`;

      return (
        <div key={item.id_activo} className="group bg-[#161B28] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-green-500/50 transition-all duration-500 shadow-2xl">
          
          <div className="aspect-[4/5] bg-slate-900 relative overflow-hidden">
            {/* La magia ocurre aquí: busca por el nombre del artículo */}
            <img 
              src={dynamicUrl} 
              className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0" 
              alt={item.nombre_articulo}
              onError={(e) => { e.target.src = imageUrl; }} // Si falla la búsqueda, pone una herramienta genérica
            />
            
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-green-500/30">
               <p className="text-[9px] font-black text-green-400">-{ (item.peso_kg * 2.5).toFixed(1) }kg CO2</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#161B28] via-transparent to-transparent"></div>
          </div>

          <div className="p-8 -mt-12 relative z-10">
            <div className="mb-6">
              <p className="text-[8px] font-black text-green-500 uppercase tracking-[0.2em] mb-2">
                {item.categories?.nombre_categoria || 'Activo Circular'}
              </p>
              <h4 className="text-2xl font-black uppercase tracking-tighter leading-none truncate">
                {item.nombre_articulo}
              </h4>
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
      );
    })
  ) : (
    // Esqueleto de carga (Skeleton)
    [1,2,3,4].map(i => (
      <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-[2.5rem] border border-white/5"></div>
    ))
  )}
</div>