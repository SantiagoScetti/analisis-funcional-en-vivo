import FastMarquee from 'react-fast-marquee';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import './FeedMensajes.css';

const Marquee = FastMarquee.default || FastMarquee;

export default function FeedMensajes({ mensajes }) {
  // Aplicamos el método inmutable slice para tomar solo los 10 más recientes
  const ultimosMensajes = mensajes.slice(0, 10);

  const getIcon = (sentimiento) => {
    if (sentimiento === 'POS') return <ThumbsUp size={16} className="text-success" />;
    if (sentimiento === 'NEG') return <ThumbsDown size={16} className="text-danger" />;
    return <Minus size={16} className="text-neutral" />;
  };

  if (!ultimosMensajes || ultimosMensajes.length === 0) return null;

  return (
    <div className="feed-container">
      <h3 className="feed-title">Opiniones en Vivo</h3>
      <Marquee gradient={true} gradientColor={[248, 250, 252]} speed={40} pauseOnHover={true}>
        {ultimosMensajes.map((msg, idx) => (
          <div key={idx} className="feed-card">
            <div className={`feed-icon-bg bg-${msg.sentimiento === 'POS' ? 'positivo' : msg.sentimiento === 'NEG' ? 'negativo' : 'neutral'}`}>
              {getIcon(msg.sentimiento)}
            </div>
            <p className="feed-text">{msg.texto_original}</p>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
