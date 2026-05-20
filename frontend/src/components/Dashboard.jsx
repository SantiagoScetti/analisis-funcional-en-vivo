import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

export default function Dashboard() {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS'); // 'TODOS', 'POS', 'NEG', 'NEU'

  const formatFecha = (fecha) => {
    const d = new Date(fecha);
    const dateStr = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(d);
    const timeStr = new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit', minute: '2-digit', hour12: false
    }).format(d);
    return `${dateStr} • ${timeStr}`;
  };

  const fetchMensajes = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/mensajes');
      if (!res.ok) throw new Error('Error al obtener mensajes');
      const data = await res.json();
      
      const mensajesProcesados = data
        .filter(msg => msg.texto_original && msg.texto_original.length > 0)
        .map(msg => ({
          ...msg,
          fechaFormateada: formatFecha(msg.fecha_creacion || Date.now())
        }));

      setMensajes(mensajesProcesados);
    } catch (error) {
      console.error(error);
      const dummyData = [
        { texto_original: '¡Me encantó la clase de hoy!', sentimiento: 'POS', fecha_creacion: Date.now() },
        { texto_original: 'No entendí muy bien la última parte.', sentimiento: 'NEG', fecha_creacion: Date.now() - 100000 },
        { texto_original: 'Todo normal, sin dudas.', sentimiento: 'NEU', fecha_creacion: Date.now() - 200000 }
      ].filter(msg => msg.texto_original.length > 0)
       .map(msg => ({
        ...msg,
        fechaFormateada: formatFecha(msg.fecha_creacion)
      }));
      setMensajes(dummyData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensajes();
    const interval = setInterval(fetchMensajes, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderSentimientoIcon = (sentimiento) => {
    if (sentimiento === 'POS') return <ThumbsUp size={18} className="text-success" />;
    if (sentimiento === 'NEG') return <ThumbsDown size={18} className="text-danger" />;
    return <Minus size={18} className="text-neutral" />;
  };

  if (loading && mensajes.length === 0) {
    return <div className="dashboard-loading">Cargando dashboard...</div>;
  }

  const mensajesMostrados = mensajes.filter(msg => {
    if (filtro === 'TODOS') return true;
    return msg.sentimiento === filtro;
  });

  const total = mensajes.length;
  const countPos = mensajes.filter(m => m.sentimiento === 'POS').length;
  const countNeg = mensajes.filter(m => m.sentimiento === 'NEG').length;
  const countNeu = mensajes.filter(m => m.sentimiento === 'NEU').length;
  
  const pctPos = total > 0 ? (countPos / total) * 100 : 0;
  const pctNeg = total > 0 ? (countNeg / total) * 100 : 0;
  const pctNeu = total > 0 ? (countNeu / total) * 100 : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard de Sentimientos</h2>
        <p className="dashboard-subtitle">Monitor de opiniones en tiempo real</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-value">{mensajes.length}</span>
          <span className="stat-label">Total Mensajes</span>
        </div>
        <div className="stat-card border-positivo shadow-positivo">
          <span className="stat-value text-success">
            {mensajes.filter(m => m.sentimiento === 'POS').length}
          </span>
          <span className="stat-label">Positivos</span>
        </div>
        <div className="stat-card border-negativo shadow-negativo">
          <span className="stat-value text-danger">
            {mensajes.filter(m => m.sentimiento === 'NEG').length}
          </span>
          <span className="stat-label">Negativos</span>
        </div>
        <div className="stat-card" style={{ gridColumn: "span 2" }}>
          <span className="stat-label mb-2" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Proporción General</span>
          <div style={{ width: '100%', height: '12px', display: 'flex', borderRadius: '9999px', overflow: 'hidden', backgroundColor: '#f1f5f9', marginTop: '0.5rem' }}>
            <div style={{ width: `${pctPos}%`, backgroundColor: '#22c55e', transition: 'width 0.5s ease' }} title={`Positivos: ${countPos}`}></div>
            <div style={{ width: `${pctNeu}%`, backgroundColor: '#94a3b8', transition: 'width 0.5s ease' }} title={`Neutros: ${countNeu}`}></div>
            <div style={{ width: `${pctNeg}%`, backgroundColor: '#ef4444', transition: 'width 0.5s ease' }} title={`Negativos: ${countNeg}`}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', width: '100%' }}>
            <span>{pctPos.toFixed(0)}% Pos</span>
            <span>{pctNeu.toFixed(0)}% Neu</span>
            <span>{pctNeg.toFixed(0)}% Neg</span>
          </div>
        </div>
      </div>
      
      <div className="filtros-wrapper">
        <div className="filtros-container">
          <button 
            className={`filtro-btn ${filtro === 'TODOS' ? 'active' : ''}`}
            onClick={() => setFiltro('TODOS')}
          >
            Todos
          </button>
          <button 
            className={`filtro-btn ${filtro === 'POS' ? 'active' : ''}`}
            onClick={() => setFiltro('POS')}
          >
            Positivos
          </button>
          <button 
            className={`filtro-btn ${filtro === 'NEG' ? 'active' : ''}`}
            onClick={() => setFiltro('NEG')}
          >
            Negativos
          </button>
          <button 
            className={`filtro-btn ${filtro === 'NEU' ? 'active' : ''}`}
            onClick={() => setFiltro('NEU')}
          >
            Neutros
          </button>
        </div>
      </div>

      <div className="mensajes-grid">
        {mensajesMostrados.map((msg, index) => (
          <div key={index} className={`mensaje-card hover-elevate card-border-${msg.sentimiento === 'POS' ? 'positivo' : msg.sentimiento === 'NEG' ? 'negativo' : 'neutral'} card-shadow-${msg.sentimiento === 'POS' ? 'positivo' : msg.sentimiento === 'NEG' ? 'negativo' : 'neutral'}`}>
            <div className="mensaje-header">
              <div className={`mensaje-icon-wrapper bg-${msg.sentimiento === 'POS' ? 'positivo' : msg.sentimiento === 'NEG' ? 'negativo' : 'neutral'}`}>
                {renderSentimientoIcon(msg.sentimiento)}
              </div>
              <span className="mensaje-fecha">{msg.fechaFormateada}</span>
            </div>
            <p className="mensaje-texto">{msg.texto_original}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
