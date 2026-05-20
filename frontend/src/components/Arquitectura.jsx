import './Arquitectura.css';

export default function Arquitectura() {
  return (
    <article className="arquitectura-container">
      {/* ════════════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════════════ */}
      <header className="arquitectura-header">
        <h1>Arquitectura del Sistema</h1>
        <p>
          Un análisis profundo del ciclo de vida del dato, desde su captura hasta
          su visualización, vinculando cada etapa con los principios fundamentales
          del <strong>Paradigma Funcional</strong>.
        </p>
      </header>

      {/* ── Visión General ─────────────────────────────────────────── */}
      <section className="arq-section">
        <p className="arq-lead">
          La presente arquitectura adopta un diseño por capas desacopladas que orbita
          en torno a un principio rector: <strong>el dato fluye a través de
          transformaciones puras y predecibles, mientras que los efectos secundarios
          quedan confinados en los bordes del sistema</strong>. Esta decisión responde
          a la aplicación deliberada de los fundamentos del Paradigma Funcional en un
          contexto de ingeniería de software moderna.
        </p>

        <div className="arq-stack-row">
          <span className="arq-badge arq-badge--react">⚛️ React</span>
          <span className="arq-badge arq-badge--fastapi">⚡ FastAPI</span>
          <span className="arq-badge arq-badge--ml">🤖 Robertuito ML</span>
          <span className="arq-badge arq-badge--db">🗄️ Neon.tech + PostgreSQL</span>
        </div>

        <img
          src="/diagrama-vision-general.png"
          alt="Diagrama de visión general del flujo de datos"
          className="arq-diagram"
        />
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FASE 1 — Emisión y Flujo Unidireccional (Frontend)
      ════════════════════════════════════════════════════════════════ */}
      <section className="arq-phase-card">
        <div className="arq-phase-number">Fase 1</div>
        <h2>Emisión y Flujo Unidireccional (Frontend)</h2>

        <h3>1.1. Captura del Dato de Entrada</h3>
        <p>
          El ciclo de vida del dato se inicia en la <strong>interfaz de usuario</strong>,
          construida con React. El usuario interactúa con un componente de formulario
          —un campo de texto y un botón de envío— que constituye el único punto de
          entrada de datos al sistema.
        </p>
        <p>
          Cuando el usuario escribe un mensaje y presiona el botón de enviar, React
          captura el valor del campo a través de su mecanismo de <strong>estado local</strong>
          {' '}(<code>useState</code>). Este estado es una variable reactiva encapsulada
          dentro del componente; su modificación desencadena un nuevo ciclo de renderizado,
          garantizando que la interfaz siempre refleje el valor más reciente del dato.
        </p>

        <pre className="arq-code"><code>{`const [mensaje, setMensaje] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!mensaje.trim()) return;

  const res = await fetch('http://127.0.0.1:8000/api/mensajes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto_original: mensaje }),
  });

  if (!res.ok) throw new Error('Error al enviar mensaje');
  setMensaje(''); // Resetea el estado local tras el envío
};`}</code></pre>

        <h3>1.2. Construcción y Emisión del Payload</h3>
        <p>
          El valor capturado se encapsula en un objeto JSON con la
          estructura <code>{`{ "texto_original": "..." }`}</code> y se transmite mediante
          una solicitud <strong>HTTP POST</strong> hacia el endpoint <code>/api/mensajes</code> del
          backend. Este objeto constituye el <em>payload</em>, la carga útil de datos que
          viaja desde el cliente hacia el servidor.
        </p>

        <h3>1.3. Vínculo Funcional: Flujo de Datos Unidireccional</h3>
        <p>
          React implementa de forma nativa un <strong>flujo de datos unidireccional</strong>
          {' '}(<em>one-way data flow</em>). La información se propaga en una sola dirección:
          desde el estado del componente hacia la vista (renderizado) y desde la acción del
          usuario hacia la actualización del estado. No existen enlaces bidireccionales que
          muten el estado de forma implícita.
        </p>

        <div className="arq-alert arq-alert--important">
          <span className="arq-alert-icon">ℹ️</span>
          <div>
            <strong>Importante:</strong> El flujo unidireccional elimina efectos colaterales
            impredecibles en la capa de presentación. Cada ciclo de renderizado es una{' '}
            <strong>proyección determinista</strong> del estado actual, lo cual facilita el
            razonamiento sobre el comportamiento del sistema.
          </div>
        </div>

        <img
          src="/diagrama-fase-1.png"
          alt="Diagrama del flujo unidireccional en React"
          className="arq-diagram"
        />
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FASE 2 — El Pipeline Inmutable (Backend)
      ════════════════════════════════════════════════════════════════ */}
      <section className="arq-phase-card">
        <div className="arq-phase-number">Fase 2</div>
        <h2>El Pipeline Inmutable (El Corazón Funcional del Backend)</h2>

        <h3>2.1. Recepción del Dato en FastAPI</h3>
        <p>
          El backend, implementado con <strong>FastAPI</strong>, recibe la solicitud POST en
          su endpoint <code>/api/mensajes</code>. FastAPI deserializa automáticamente el cuerpo
          JSON y lo valida contra un esquema definido mediante <strong>Pydantic</strong>:
        </p>

        <pre className="arq-code"><code>{`from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MensajeCreate(BaseModel):
    texto_original: str

class MensajeOut(BaseModel):
    id: int
    texto_original: str
    texto_limpio: Optional[str]
    sentimiento: Optional[str]
    fecha_creacion: datetime

    model_config = ConfigDict(from_attributes=True)`}</code></pre>

        <p>
          En este punto, el sistema dispone del <code>texto_original</code> —la cadena de
          texto cruda tal como la escribió el usuario— y comienza la fase de{' '}
          <strong>transformación funcional</strong>.
        </p>

        <h3>2.2. Funciones Puras de Transformación</h3>
        <p>
          Una <strong>función pura</strong> cumple con dos propiedades fundamentales:
        </p>
        <ol className="arq-ordered-list">
          <li><strong>Determinismo:</strong> dada la misma entrada, siempre produce la misma salida.</li>
          <li><strong>Ausencia de efectos secundarios:</strong> no modifica ningún estado externo.</li>
        </ol>
        <p>
          Cada función de limpieza recibe una cadena de texto como argumento y retorna
          una <strong>nueva cadena de texto</strong> transformada, sin modificar la original:
        </p>

        <pre className="arq-code"><code>{`def to_lowercase(text: str) -> str:
    """Convierte el texto a minúsculas."""
    return text.lower()

def remove_special_chars(text: str) -> str:
    """Mantiene solo letras, números y espacios."""
    return re.sub(r'[^\\w\\s]', '', text)

def strip_whitespaces(text: str) -> str:
    """Elimina espacios extra."""
    return " ".join(text.split())`}</code></pre>

        <div className="arq-alert arq-alert--note">
          <span className="arq-alert-icon">📝</span>
          <div>
            <strong>Nota:</strong> Ninguna de estas funciones utiliza la palabra clave{' '}
            <code>global</code>, ni modifica una lista, ni escribe en un archivo. Cada
            una <strong>recibe un <code>str</code> y retorna un nuevo <code>str</code></strong>.
            Este es el sello distintivo de la pureza funcional.
          </div>
        </div>

        <h3>2.3. Composición mediante <code>reduce</code> (Función de Orden Superior)</h3>
        <p>
          Las funciones puras deben ejecutarse <strong>en secuencia</strong>, donde la salida
          de una se convierte en la entrada de la siguiente. Este patrón se denomina{' '}
          <strong>composición de funciones</strong> y es uno de los pilares del paradigma funcional.
        </p>
        <p>
          Para orquestar esta composición, se define una función auxiliar <code>compose</code> que
          utiliza internamente <code>reduce</code> del módulo <code>functools</code> de
          Python. <code>reduce</code> es una <strong>función de orden superior</strong>: recibe{' '}
          <em>otras funciones</em> como argumento.
        </p>

        <pre className="arq-code"><code>{`from functools import reduce
from typing import Callable

def compose(*functions: Callable[[str], str]) -> Callable[[str], str]:
    """Toma múltiples funciones puras y retorna una nueva función
    que es la composición de todas ellas (de izquierda a derecha).
    No usa bucles for ni variables mutables."""
    return reduce(lambda f, g: lambda x: g(f(x)), functions)

# Definimos el pipeline inmutable
pipeline_limpieza = compose(
    to_lowercase,
    remove_special_chars,
    strip_whitespaces
)

def procesar_texto_funcional(texto: str) -> str:
    """Punto de entrada para el procesamiento.
    Aplica el pipeline funcional al texto entrante."""
    return pipeline_limpieza(texto)`}</code></pre>

        <div className="arq-table-wrapper">
          <table className="arq-table">
            <thead>
              <tr>
                <th>Iteración</th>
                <th>Entrada (<code>texto_acumulado</code>)</th>
                <th>Función aplicada</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td><code>texto_original</code></td>
                <td><code>to_lowercase</code></td>
                <td>Texto en minúsculas</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Texto en minúsculas</td>
                <td><code>remove_special_chars</code></td>
                <td>Texto sin caracteres especiales</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Texto sin caracteres especiales</td>
                <td><code>strip_whitespaces</code></td>
                <td><strong>texto_limpio final</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <img
          src="/diagrama-fase-2.png"
          alt="Diagrama del pipeline funcional de limpieza"
          className="arq-diagram"
        />

        <h3>2.4. Vínculo Funcional: Inmutabilidad Absoluta</h3>
        <p>
          El concepto de <strong>inmutabilidad</strong> establece que, una vez creado, un
          dato <strong>no debe ser modificado</strong>. En lugar de alterar el valor original,
          cada transformación produce un <em>nuevo valor</em>. El <code>texto_original</code> que
          ingresó al pipeline permanece intacto en memoria; lo que se propaga hacia la siguiente
          fase es una entidad completamente nueva: el <code>texto_limpio</code>.
        </p>
        <ul className="arq-benefit-list">
          <li><strong>Trazabilidad:</strong> al conservar ambos textos, es posible auditar y reproducir cada transformación.</li>
          <li><strong>Sin errores por mutación compartida:</strong> se eliminan las condiciones de carrera y los errores por mutación inesperada.</li>
          <li><strong>Testabilidad:</strong> cada función se prueba de forma aislada con entradas y salidas predefinidas.</li>
        </ul>

        <div className="arq-alert arq-alert--caution">
          <span className="arq-alert-icon">⚠️</span>
          <div>
            <strong>Precaución:</strong> En un diseño imperativo tradicional, sería tentador
            modificar la variable <code>texto_original</code> directamente en cada paso
            (ej: <code>texto_original = texto_original.lower()</code>). Este enfoque{' '}
            <strong>viola la inmutabilidad</strong>, dificulta la depuración y destruye la
            posibilidad de auditoría del dato original.
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FASE 3 — Clasificación Determinista (Machine Learning)
      ════════════════════════════════════════════════════════════════ */}
      <section className="arq-phase-card">
        <div className="arq-phase-number">Fase 3</div>
        <h2>Clasificación Determinista (Machine Learning)</h2>

        <h3>3.1. Ingreso del Texto Limpio al Modelo</h3>
        <p>
          Una vez producido el <code>texto_limpio</code>, este se envía al modelo de{' '}
          <strong>análisis de sentimiento</strong> pre-entrenado{' '}
          <code>robertuito-sentiment-analysis</code>, disponible en HuggingFace.
          Este modelo está basado en la arquitectura <strong>RoBERTa</strong>, específicamente
          ajustado (<em>fine-tuned</em>) para clasificar texto en español según su polaridad
          sentimental.
        </p>

        <pre className="arq-code"><code>{`from transformers import pipeline

# Inicializamos el pipeline de clasificación de texto.
# Este modelo se descargará la primera vez que se ejecute el servidor.
print("Cargando modelo de ML (pysentimiento/robertuito-sentiment-analysis)...")
sentiment_pipeline = pipeline(
    "text-classification",
    model="pysentimiento/robertuito-sentiment-analysis"
)
print("Modelo cargado exitosamente.")

def clasificar_sentimiento(texto: str) -> str:
    """Recibe un texto limpio y devuelve la etiqueta de sentimiento predicha.
    Retorna 'POS' (Positivo), 'NEG' (Negativo) o 'NEU' (Neutro)."""
    if not texto.strip():
        return "NEU"

    resultado = sentiment_pipeline(texto)
    etiqueta = resultado[0]['label']
    return etiqueta`}</code></pre>

        <h3>3.2. Taxonomía de la Clasificación</h3>
        <div className="arq-table-wrapper">
          <table className="arq-table">
            <thead>
              <tr>
                <th>Etiqueta</th>
                <th>Significado</th>
                <th>Ejemplo ilustrativo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="arq-label arq-label--pos">POS</code></td>
                <td>Sentimiento <strong>positivo</strong></td>
                <td><em>"Me encanta esta aplicación, funciona perfecto"</em></td>
              </tr>
              <tr>
                <td><code className="arq-label arq-label--neg">NEG</code></td>
                <td>Sentimiento <strong>negativo</strong></td>
                <td><em>"Pésimo servicio, no lo recomiendo"</em></td>
              </tr>
              <tr>
                <td><code className="arq-label arq-label--neu">NEU</code></td>
                <td>Sentimiento <strong>neutro</strong></td>
                <td><em>"El horario de atención es de 9 a 18"</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>3.3. Vínculo Funcional: Determinismo y Transparencia Referencial</h3>
        <p>
          Desde la perspectiva funcional, la inferencia del modelo se comporta como una{' '}
          <strong>función determinista</strong>: dada una misma cadena de texto como entrada,
          el modelo produce invariablemente la misma etiqueta de sentimiento como salida.
        </p>
        <p>
          Este comportamiento satisface el principio de <strong>transparencia referencial</strong>
          {' '}(<em>referential transparency</em>): la invocación{' '}
          <code>clasificar_sentimiento("me encanta esta app")</code> puede ser sustituida
          por su resultado <code>"POS"</code> en cualquier punto del programa sin alterar el
          comportamiento del sistema.
        </p>

        <div className="arq-alert arq-alert--tip">
          <span className="arq-alert-icon">💡</span>
          <div>
            <strong>Tip:</strong> La transparencia referencial habilita una optimización clave:
            el <strong>caché de inferencias</strong> (<em>memoization</em>). Si un texto idéntico
            ya fue clasificado previamente, el sistema podría retornar el resultado almacenado sin
            invocar al modelo, reduciendo latencia y consumo de recursos.
          </div>
        </div>

        <img
          src="/diagrama-fase-3.png"
          alt="Diagrama de clasificación determinista del modelo"
          className="arq-diagram"
        />
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FASE 4 — Aislamiento de Efectos Secundarios (Persistencia)
      ════════════════════════════════════════════════════════════════ */}
      <section className="arq-phase-card">
        <div className="arq-phase-number">Fase 4</div>
        <h2>Aislamiento de Efectos Secundarios (Persistencia en Neon.tech)</h2>

        <h3>4.1. Construcción del Registro</h3>
        <p>
          Al finalizar las fases de transformación pura y clasificación determinista, el sistema
          dispone de tres datos concretos: <code>texto_original</code>,{' '}
          <code>texto_limpio</code> y <code>sentimiento</code>. Con ellos se construye una
          instancia del modelo ORM <code>Mensaje</code>, definido mediante <strong>SQLAlchemy</strong>,
          que mapea directamente a la tabla <code>mensajes</code> de PostgreSQL en Neon.tech:
        </p>

        <pre className="arq-code"><code>{`from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from database import Base

class Mensaje(Base):
    __tablename__ = "mensajes"

    id = Column(Integer, primary_key=True, index=True)
    texto_original = Column(String, nullable=False)
    texto_limpio = Column(String, nullable=True)
    sentimiento = Column(String, nullable=True)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc))`}</code></pre>

        <div className="arq-table-wrapper">
          <table className="arq-table">
            <thead>
              <tr>
                <th>Columna</th>
                <th>Tipo</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>id</code></td>
                <td><code>Integer</code></td>
                <td>Clave primaria autoincremental</td>
              </tr>
              <tr>
                <td><code>texto_original</code></td>
                <td><code>String</code></td>
                <td>Texto crudo ingresado por el usuario</td>
              </tr>
              <tr>
                <td><code>texto_limpio</code></td>
                <td><code>String</code></td>
                <td>Texto resultante del pipeline funcional</td>
              </tr>
              <tr>
                <td><code>sentimiento</code></td>
                <td><code>String</code></td>
                <td>Etiqueta de clasificación (POS, NEG, NEU)</td>
              </tr>
              <tr>
                <td><code>fecha_creacion</code></td>
                <td><code>DateTime</code></td>
                <td>Marca temporal generada por el servidor de BD</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>4.2. Ejecución de la Operación de Escritura</h3>
        <pre className="arq-code"><code>{`@app.post("/api/mensajes", response_model=schemas.MensajeOut)
def crear_mensaje(mensaje_in: schemas.MensajeCreate,
                  db: Session = Depends(database.get_db)):
    """Recibe un mensaje crudo, lo procesa con el pipeline funcional
    puro, predice el sentimiento con ML y guarda el resultado."""
    # 1. Pipeline Funcional Puro
    texto_procesado = procesar_texto_funcional(mensaje_in.texto_original)

    # 2. Predicción con Machine Learning
    sentimiento_predicho = clasificar_sentimiento(texto_procesado)

    # 3. Creación del objeto de SQLAlchemy
    nuevo_mensaje = models.Mensaje(
        texto_original=mensaje_in.texto_original,
        texto_limpio=texto_procesado,
        sentimiento=sentimiento_predicho
    )

    # 4. Guardado en Base de Datos (Efecto Secundario controlado)
    db.add(nuevo_mensaje)
    db.commit()
    db.refresh(nuevo_mensaje)
    return nuevo_mensaje`}</code></pre>

        <h3>4.3. Vínculo Funcional: "Functional Core, Imperative Shell"</h3>
        <p>
          En el paradigma funcional, un <strong>efecto secundario</strong> (<em>side effect</em>)
          es cualquier operación que interactúa con el mundo exterior: escribir en una base de datos,
          enviar un correo electrónico o modificar un archivo en disco. Estas operaciones son
          inherentemente <strong>impuras</strong>.
        </p>
        <p>
          La operación de persistencia dentro de <code>crear_mensaje()</code> es un efecto
          secundario: <strong>muta el estado de un sistema externo</strong> (PostgreSQL en
          Neon.tech). Sin embargo, el diseño arquitectónico minimiza el impacto de esta
          impureza: <em>las impurezas se empujan hacia los bordes del sistema</em>.
        </p>

        <img
          src="/diagrama-fase-4.png"
          alt="Diagrama del patrón Functional Core / Imperative Shell"
          className="arq-diagram"
        />

        <ul className="arq-benefit-list">
          <li>
            <strong>El núcleo puro es trivialmente testeable:</strong> funciones de limpieza y
            clasificación se prueban con pruebas unitarias simples, sin mocks.
          </li>
          <li>
            <strong>Los errores de I/O quedan contenidos:</strong> si la base de datos falla,
            el error se manifiesta exclusivamente en la corteza. El pipeline permanece intacto.
          </li>
          <li>
            <strong>Separación clara de responsabilidades:</strong> lógica de negocio (limpiar y
            clasificar) desacoplada de la infraestructura (persistir y comunicar).
          </li>
        </ul>

        <div className="arq-alert arq-alert--caution">
          <span className="arq-alert-icon">⚠️</span>
          <div>
            <strong>Advertencia:</strong> Si las operaciones de I/O estuvieran entremezcladas
            con la lógica de transformación (por ejemplo, si una función de limpieza también
            escribiera en un log de base de datos), la testabilidad y la predictibilidad del
            sistema se degradarían significativamente. El aislamiento de efectos secundarios
            es una <strong>decisión arquitectónica</strong>, no un accidente.
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FASE 5 — Proyecciones Funcionales (Dashboard en Vivo)
      ════════════════════════════════════════════════════════════════ */}
      <section className="arq-phase-card">
        <div className="arq-phase-number">Fase 5</div>
        <h2>Proyecciones Funcionales (Dashboard en Vivo)</h2>

        <h3>5.1. Consulta y Obtención de Mensajes</h3>
        <p>
          Para la visualización del dashboard, el frontend realiza una solicitud{' '}
          <strong>HTTP GET</strong> al endpoint <code>/api/mensajes</code>. FastAPI consulta la
          tabla <code>mensajes</code> y retorna la colección de registros en formato JSON:
        </p>

        <pre className="arq-code"><code>{`@app.get("/api/mensajes", response_model=List[schemas.MensajeOut])
def obtener_mensajes(db: Session = Depends(database.get_db)):
    """Endpoint para recuperar todas las opiniones registradas.
    Aplica los principios funcionales de proyección mapeando
    la tabla directamente al esquema de salida."""
    mensajes = db.query(models.Mensaje).order_by(
        models.Mensaje.fecha_creacion.desc()
    ).all()
    return mensajes`}</code></pre>

        <p>El frontend recibe un arreglo de objetos JSON:</p>

        <pre className="arq-code"><code>{`[
  {
    "id": 1,
    "texto_original": "¡Me encanta esta app! 🎉",
    "texto_limpio": "me encanta esta app",
    "sentimiento": "POS",
    "fecha_creacion": "2026-05-19T23:15:00"
  },
  {
    "id": 2,
    "texto_original": "Pésimo servicio...",
    "texto_limpio": "psimo servicio",
    "sentimiento": "NEG",
    "fecha_creacion": "2026-05-19T23:16:30"
  }
]`}</code></pre>

        <h3>5.2. Renderizado de Tarjetas mediante <code>.map()</code></h3>
        <p>
          Para proyectar cada registro como una tarjeta visual, React utiliza la función de
          orden superior <code>.map()</code>. Esta función <strong>no modifica</strong> el arreglo
          original; genera un <strong>nuevo arreglo</strong> de elementos JSX:
        </p>

        <pre className="arq-code"><code>{`const TarjetasMensajes = ({ mensajes }) => {
  return (
    <div className="grid-tarjetas">
      {mensajes.map((msg) => (
        <div
          key={msg.id}
          className={\`tarjeta tarjeta--\${msg.sentimiento.toLowerCase()}\`}
        >
          <p className="tarjeta__original">"{msg.texto_original}"</p>
          <p className="tarjeta__limpio">Procesado: {msg.texto_limpio}</p>
          <span className="tarjeta__badge">{msg.sentimiento}</span>
          <time className="tarjeta__fecha">{msg.fecha_creacion}</time>
        </div>
      ))}
    </div>
  );
};`}</code></pre>

        <ul className="arq-benefit-list">
          <li><strong>No muta</strong> el arreglo <code>mensajes</code> — produce un arreglo nuevo.</li>
          <li>Cada iteración es <strong>independiente</strong> — el procesamiento de un elemento no afecta al siguiente.</li>
          <li>La función pasada como argumento es <strong>pura</strong> — dado un mismo <code>msg</code>, siempre genera el mismo JSX.</li>
        </ul>

        <h3>5.3. Filtrado Condicional mediante <code>.filter()</code></h3>
        <p>
          Para calcular las proporciones del gráfico de distribución, se emplea{' '}
          <code>.filter()</code>, que genera <strong>nuevas colecciones</strong> a partir de
          criterios de selección sin alterar la colección original:
        </p>

        <pre className="arq-code"><code>{`const calcularEstadisticas = (mensajes) => {
  const positivos = mensajes.filter((m) => m.sentimiento === "POS");
  const negativos = mensajes.filter((m) => m.sentimiento === "NEG");
  const neutros   = mensajes.filter((m) => m.sentimiento === "NEU");

  const total = mensajes.length;

  return {
    positivos: ((positivos.length / total) * 100).toFixed(1),
    negativos: ((negativos.length / total) * 100).toFixed(1),
    neutros:   ((neutros.length / total) * 100).toFixed(1),
    conteos: {
      POS: positivos.length,
      NEG: negativos.length,
      NEU: neutros.length,
    },
  };
};`}</code></pre>

        <h3>5.4. Vínculo Funcional: Funciones de Orden Superior</h3>
        <p>
          <code>.map()</code> y <code>.filter()</code> son <strong>funciones de orden
          superior</strong>: funciones que reciben otras funciones como argumento. Este concepto
          permite expresar transformaciones de datos de forma <strong>declarativa</strong> — el
          programador especifica <em>qué</em> quiere obtener, no <em>cómo</em> iterar.
        </p>
        <p>
          El rasgo más significativo es que <strong>jamás mutan la colección fuente</strong>.
          Cada invocación produce una <em>nueva estructura de datos</em>, dejando la original
          intacta. Este comportamiento es la manifestación directa de la{' '}
          <strong>inmutabilidad</strong> en la capa de presentación, cerrando el ciclo completo
          de diseño funcional iniciado en el backend.
        </p>

        <div className="arq-alert arq-alert--note">
          <span className="arq-alert-icon">📝</span>
          <div>
            <strong>Nota:</strong> El arreglo <code>mensajes</code> es utilizado como{' '}
            <strong>fuente de lectura</strong> tanto por <code>.map()</code> como
            por <code>.filter()</code>. Ninguna de estas operaciones lo altera. Si se añade
            un nuevo mensaje, se obtiene un arreglo completamente nuevo desde la API y las
            proyecciones se recalculan desde cero.
          </div>
        </div>

        <img
          src="/diagrama-fase-5.png"
          alt="Diagrama de proyecciones funcionales en el dashboard"
          className="arq-diagram"
        />
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SÍNTESIS — Recorrido Completo del Dato
      ════════════════════════════════════════════════════════════════ */}
      <section className="arq-section arq-synthesis">
        <h2>Síntesis: El Recorrido Completo del Dato</h2>

        <img
          src="/diagrama-sintesis.png"
          alt="Diagrama del recorrido completo del dato con indicadores de pureza"
          className="arq-diagram"
        />

        <div className="arq-table-wrapper">
          <table className="arq-table arq-table--synthesis">
            <thead>
              <tr>
                <th>Fase</th>
                <th>Operación</th>
                <th>Pureza</th>
                <th>Concepto Funcional</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Captura y envío HTTP</td>
                <td><span className="arq-purity arq-purity--impure">🔴 Impura</span></td>
                <td>Flujo unidireccional de datos</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Pipeline de limpieza</td>
                <td><span className="arq-purity arq-purity--pure">🟢 Pura</span></td>
                <td>Composición de funciones puras, inmutabilidad, <code>reduce</code></td>
              </tr>
              <tr>
                <td>3</td>
                <td>Inferencia del modelo</td>
                <td><span className="arq-purity arq-purity--pure">🟢 Pura</span></td>
                <td>Determinismo, transparencia referencial</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Escritura en base de datos</td>
                <td><span className="arq-purity arq-purity--impure">🔴 Impura</span></td>
                <td>Aislamiento de efectos secundarios</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Renderizado del dashboard</td>
                <td><span className="arq-purity arq-purity--pure">🟢 Pura</span></td>
                <td>Funciones de orden superior (<code>.map()</code>, <code>.filter()</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CONCLUSIÓN
      ════════════════════════════════════════════════════════════════ */}
      <section className="arq-section arq-conclusion">
        <h2>Conclusión</h2>
        <p>
          La arquitectura presentada demuestra que los principios del paradigma funcional no se
          limitan a lenguajes puramente funcionales como Haskell o Erlang. A través de decisiones
          de diseño deliberadas —composición de funciones puras, inmutabilidad de los datos,
          aislamiento de efectos secundarios en los bordes del sistema y uso extensivo de funciones
          de orden superior—, es posible construir sistemas en lenguajes multiparadigma como
          Python y JavaScript que exhiban las garantías de predictibilidad, testabilidad y
          mantenibilidad que el paradigma funcional promueve.
        </p>
        <p className="arq-closing-statement">
          El dato, desde su nacimiento como <code>texto_original</code> hasta su proyección visual
          en el dashboard, atraviesa un camino donde{' '}
          <strong>la pureza es la norma y la impureza es la excepción controlada</strong>.
          Este es el principio rector de la arquitectura adoptada.
        </p>
      </section>
    </article>
  );
}
