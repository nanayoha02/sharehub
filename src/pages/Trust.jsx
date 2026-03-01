import { useMemo, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '../supabaseClient';

export default function Impact() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchImpactData() {
      const { data, error } = await supabase
        .from('assets')
        .select(`
          nombre_articulo, 
          peso_kg, 
          precio_dia,
          categories (nombre_categoria)
        `);
      
      if (!error && data) {
        const datosFormateados = data.map(item => ({
          nombre: item.nombre_articulo,
          co2: (parseFloat(item.peso_kg || 0) * 3).toFixed(1), 
          precio: item.precio_dia,
          categoria: item.categories?.nombre_categoria || 'Otros'
        }));
        setDatos(datosFormateados);
      }
      setCargando(false);
    }
    fetchImpactData();
  }, []);

  const metricas = useMemo(() => {
    const totalCO2 = datos.reduce((acc, item) => acc + parseFloat(item.co2 || 0), 0);
    const totalActivos = datos.length;
    const valorEconomico = datos.reduce((acc, item) => acc + (parseFloat(item.precio || 0) * 0.8), 0);

    return {
      co2: totalCO2.toFixed(1),
      activos: totalActivos,
      ahorro: valorEconomico.toFixed(2)
    };
  }, [datos]);

  const topActivosData = useMemo(() => {
    return [...datos]
      .sort((a, b) => b.co2 - a.co2)
      .slice(0, 5)
      .map(item => ({
        name: item.nombre.substring(0, 10),
        co2: parseFloat(item.co2)
      }));
  }, [datos]);

  const categoriasData = useMemo(() => {
    const grupos = datos.reduce((acc, item) => {
      const cat = item.categoria;
      acc[cat] = (acc[cat] || 0) + parseFloat(item.co2);
      return acc;
    }, {});

    return Object.keys(grupos).map(nombre => ({
      name: nombre,
      value: grupos[nombre]
    })).sort((a, b) => b.value - a.value);
  }, [datos]);

  if (cargando) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="text-center font-black text-green-500 animate-pulse uppercase tracking-[0.4em] text-xs">
        Calculando Huella Positiva...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 pb-32">
      <div className="max-w-7xl mx-auto animate-in fade-in zoom-in duration-700">
        
        {/* HEADER TIPO DASHBOARD ANALÍTICO */}
        <header className="mb-16 pt-10 border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none">
              Panel de <br /><span className="text-green-500">Impacto Real</span>
            </h2>
            <p className="text-slate-400 mt-4 font-bold uppercase tracking-[0.2em] text-[10px]">
              Virtualización de activos para combatir la crisis ambiental [cite: 2026-03-01].
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 px-6 py-3 rounded-2xl">
            <span className="text-green-400 text-[9px] font-black uppercase tracking-widest">Estado de la Red</span>
            <p className="text-xs font-bold uppercase tracking-tighter">Circular & Activa</p>
          </div>
        </header>

        {/* TARJETAS DE MÉTRICAS - DARK PREMIUM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-7xl opacity-10 group-hover:scale-125 transition-transform duration-500">🌱</div>
            <p className="text-green-400 font-black uppercase text-[10px] tracking-widest mb-2">CO₂ Evitado (ODS 13)</p>
            <h4 className="text-6xl font-black tracking-tighter italic">{metricas.co2}<span className="text-xl text-green-500/50 ml-2">kg</span></h4>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-7xl opacity-10 group-hover:scale-125 transition-transform duration-500">📦</div>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">Activos Virtualizados</p>
            <h4 className="text-6xl font-black tracking-tighter italic text-white">{metricas.activos}</h4>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-7xl opacity-10 group-hover:scale-125 transition-transform duration-500">💰</div>
            <p className="text-blue-400 font-black uppercase text-[10px] tracking-widest mb-2">Eficiencia Económica (ODS 12)</p>
            <h4 className="text-6xl font-black tracking-tighter italic text-white">${metricas.ahorro}</h4>
          </div>
        </div>

        {/* SECCIÓN DE GRÁFICAS REINVENTADA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="bg-[#161B28] border border-white/5 p-10 rounded-[3rem]">
            <h3 className="text-sm font-black text-green-400 uppercase tracking-widest mb-10 flex items-center gap-4">
              <span className="w-1.5 h-6 bg-green-500 rounded-full animate-pulse"></span>
              Top Impacto Individual (kg CO₂)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topActivosData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#475569', fontSize: 10, fontWeight: '900'}}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                    contentStyle={{backgroundColor: '#0B0F19', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}}
                  />
                  <Bar dataKey="co2" radius={[12, 12, 12, 12]} barSize={45}>
                    {topActivosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#22C55E' : '#16a34a'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#161B28] border border-white/5 p-10 rounded-[3rem]">
            <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-10 flex items-center gap-4">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full animate-pulse"></span>
              Ahorro por Categoría (Sector)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoriasData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}}
                    width={110}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{backgroundColor: '#0B0F19', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}}
                  />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={25} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PIE DE METODOLOGÍA */}
        <footer className="mt-20 bg-white/5 border border-white/10 p-12 rounded-[3.5rem] text-center">
          <h4 className="font-black text-xl uppercase italic mb-4">Metodología de la Economía del Rendimiento</h4>
          <p className="text-slate-400 text-sm max-w-4xl mx-auto leading-relaxed font-medium">
            Cada activo compartido en <strong>ShareHub</strong> evita la extracción de materias primas. 
            Extendemos la vida útil de los objetos y reducimos la huella de carbono bajo el modelo <strong>ReSOLVE</strong> [cite: 2026-03-01].
          </p>
        </footer>
      </div>
    </div>
  );
}