import { Shield, CheckCircle, Users, Lock } from 'lucide-react';

export default function Trust() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 md:p-8 pb-32">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
        
        <header className="mb-16 pt-10 text-center border-b border-white/5 pb-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic italic">
            Red de <span className="text-blue-500">Confianza</span>
          </h2>
          <p className="text-slate-400 mt-4 font-bold uppercase tracking-[0.2em] text-[10px]">
            Garantizando la seguridad en el acceso sobre propiedad [cite: 2026-03-01].
          </p>
        </header>

        {/* PILARES DE SEGURIDAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-blue-500/50 transition-colors">
            <Shield className="text-blue-500 mb-4" size={40} />
            <h3 className="font-black uppercase text-sm mb-2">Identidad Verificada</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Cada Eco Guerrero vincula su identidad oficial para asegurar transacciones responsables [cite: 2026-03-01].</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-green-500/50 transition-colors">
            <CheckCircle className="text-green-500 mb-4" size={40} />
            <h3 className="font-black uppercase text-sm mb-2">Activos Validados</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Los productos en el catálogo pasan por un filtro de calidad antes de ser virtualizados [cite: 2026-03-01].</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-purple-500/50 transition-colors">
            <Lock className="text-purple-500 mb-4" size={40} />
            <h3 className="font-black uppercase text-sm mb-2">Contratos Inteligentes</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Términos de uso claros que protegen tanto al dueño como al usuario del activo [cite: 2026-03-01].</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-orange-500/50 transition-colors">
            <Users className="text-orange-500 mb-4" size={40} />
            <h3 className="font-black uppercase text-sm mb-2">Reputación Circular</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Sistema de feedback basado en el cuidado de los activos y puntualidad [cite: 2026-03-01].</p>
          </div>
        </div>

        {/* SECCIÓN DE GARANTÍA */}
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 p-10 rounded-[3rem] text-center">
          <h4 className="text-2xl font-black uppercase italic mb-6">Nuestra Promesa de Rendimiento</h4>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-loose">
            En <strong>ShareHub</strong>, la confianza es el motor de la economía circular. No solo compartimos objetos, 
            construimos una infraestructura de acceso donde la seguridad y el respeto por el activo son la prioridad número uno [cite: 2026-03-01].
          </p>
        </div>

      </div>
    </div>
  );
}