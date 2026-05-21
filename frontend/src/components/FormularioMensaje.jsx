import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import FeedMensajes from './FeedMensajes';

export default function FormularioMensaje() {
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState('idle'); // idle, loading
  const [mensajesRecientes, setMensajesRecientes] = useState([]);

  const fetchMensajes = async () => {
    try {
      const res = await fetch('https://analisis-funcional-en-vivo.onrender.com/api/mensajes');
      if (res.ok) {
        const data = await res.json();
        // Filtramos para asegurar que haya texto
        const procesados = data.filter(msg => msg.texto_original && msg.texto_original.length > 0);
        setMensajesRecientes(procesados);
      }
    } catch (error) {
      console.error(error);
      // Dummy data fallback para previsualización
      setMensajesRecientes([
        { texto_original: '¡Excelente clase!', sentimiento: 'POS' },
        { texto_original: 'Un poco confundido', sentimiento: 'NEG' },
        { texto_original: 'Todo bien', sentimiento: 'NEU' }
      ]);
    }
  };

  useEffect(() => {
    fetchMensajes();
    const interval = setInterval(fetchMensajes, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    setEstado('loading');
    try {
      const res = await fetch('https://analisis-funcional-en-vivo.onrender.com/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto_original: mensaje }),
      });

      if (!res.ok) throw new Error('Error al enviar mensaje');
      
      setMensaje('');
      toast.success('¡Opinión analizada con éxito!');
      fetchMensajes(); // Refrescar el feed inmediatamente
    } catch (error) {
      console.error(error);
      toast.error('Hubo un problema al enviar la opinión');
    } finally {
      setEstado('idle');
    }
  };

  return (
    <div className="formulario-wrapper">
      <div className="formulario-container">
        <h2 className="title">¿Qué estás pensando?</h2>
        <p className="subtitle">Comparte tu opinión con la clase</p>
        
        <form onSubmit={handleSubmit} className="form">
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="textarea"
            rows="4"
            disabled={estado === 'loading'}
          />
          <button 
            type="submit" 
            className={`btn-submit`}
            disabled={estado === 'loading' || !mensaje.trim()}
          >
            {estado === 'loading' ? 'Procesando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>

      <FeedMensajes mensajes={mensajesRecientes} />
    </div>
  );
}
