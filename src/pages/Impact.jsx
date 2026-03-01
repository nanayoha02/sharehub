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

  if (cargando) {
    return (
      <div className="h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-r-transparent mx-auto mb-6"></div>
          <p className="text-green-500 font-black uppercase tracking-[0.3em] text-xs">Calculando Huella Positiva...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 md:p-8 pb-32">
      <div className="max-w-7xl mx-auto animate-in fade-in zoom-in duration-700">
        
        <header className="mb-8 md:mb-16 pt-6 md:pt-10 text-center md:text-left border-b border-white/5 pb-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
            Panel de <br /><span className="text-green-500">Impacto Real</span>
          </h2>
          <p className="text-slate-400 mt-4 font-bold uppercase tracking-[0.2em] text-[10px]">
            Maximizando activos, minimizando desperdicios: El legado del Modelo ReSOLVE [cite: 2026-03-01].
          </p>
        </header>

        {/* MÉTRICAS RESPONSIVAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 border border-green-500/20 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
            <p className="text-green-400 font-black uppercase text-[9px] tracking-widest mb-2">CO₂ Evitado (ODS 13)</p>
            <h4 className="text-4xl md:text-6xl font-black tracking-tighter">{metricas.co2}<span className="text-lg text-green-500/50 ml-2">kg</span></h4>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
            <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-2">Activos Virtualizados</p>
            <h4 className="text-4xl md:text-6xl font-black tracking-tighter text-white">{metricas.activos}</h4>
          </div>

          <div className="bg-white/5 border border-blue-500/20 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
            <p className="text-blue-400 font-black uppercase text-[9px] tracking-widest mb-2">Eficiencia Económica (ODS 12)</p>
            <h4 className="text-4xl md:text-6xl font-black tracking-tighter text-white">${metricas.ahorro}</h4>
          </div>
        </div>

        {/* GRÁFICAS ADAPTABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-md">
            <h3 className="text-xs font-black text-green-400 uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-1 h-5 bg-green-500 rounded-full animate-pulse"></span>
              Top Impacto (kg CO₂)
            </h3>
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topActivosData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 9, fontWeight: '900'}} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#161B28', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}} />
                  <Bar dataKey="co2" radius={[10, 10, 10, 10]} barSize={35}>
                    {topActivosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#B7FF2A' : '#22C55E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-md">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-1 h-5 bg-blue-500 rounded-full animate-pulse"></span>
              Ahorro por Sector
            </h3>
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoriasData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} width={80} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#161B28', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <footer className="mt-16 bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] text-center">
          <h4 className="font-black text-lg md:text-xl uppercase italic mb-4">Metodología del Modelo ReSOLVE</h4>
          <p className="text-slate-400 text-xs md:text-sm max-w-4xl mx-auto leading-relaxed font-medium">
            Cada activo compartido en <strong>ShareHub</strong> evita la extracción de materias primas. 
            Extendemos la vida útil de los objetos y reducimos la huella de carbono bajo estándares de 
            economía del rendimiento [cite: 2026-03-01].
          </p>
        </footer>
      </div>
    </div>
  );
}