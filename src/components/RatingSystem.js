import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Star } from 'lucide-react';

export default function RatingSystem({ idActivo, onRatingSuccess }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const guardarRating = async (valor) => {
    const emailUsuario = localStorage.getItem('user_email') || 'anonimo@red.com';
    setEnviando(true);

    try {
      const { error } = await supabase
        .from('ratings')
        .insert([
          { 
            id_activo: idActivo, 
            puntuacion: valor, 
            usuario_email: emailUsuario,
            comentario: "Valoración rápida desde catálogo" 
          }
        ]);

      if (error) throw error;

      setRating(valor);
      if (onRatingSuccess) onRatingSuccess(); // Para refrescar el catálogo
      alert("¡Valoración guardada!");
    } catch (error) {
      console.error("Error:", error.message);
      alert("No se pudo guardar la valoración");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Tu valoración:</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={enviando}
            className="transition-transform active:scale-90 disabled:opacity-50"
            onClick={() => guardarRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              size={16}
              fill={(hover || rating) >= star ? "#eab308" : "transparent"}
              className={(hover || rating) >= star ? "text-yellow-500" : "text-slate-600"}
            />
          </button>
        ))}
      </div>
    </div>
  );
}