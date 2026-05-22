from typing import List
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import database
import models
import schemas
from pipeline import procesar_texto_funcional
from ml_model import clasificar_sentimiento

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="API Backend - Análisis Funcional",
    description="API inicial construida con FastAPI y PostgreSQL",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"mensaje": "¡Bienvenido al backend de FastAPI!"}

@app.get("/health")
def health_check(db: Session = Depends(database.get_db)):
    """
    Endpoint para verificar que la aplicación está viva 
    y que la conexión a la base de datos funciona.
    """
    try:
        # Ejecutamos una consulta simple para probar la conexión
        db.execute(text("SELECT 1"))
        return {"status": "ok", "db_connection": "exitosa"}
    except Exception as e:
        return {"status": "error", "db_connection": "fallida", "detalles": str(e)}

@app.post("/api/mensajes", response_model=schemas.MensajeOut)
def crear_mensaje(mensaje_in: schemas.MensajeCreate, db: Session = Depends(database.get_db)):
    """
    Recibe un mensaje crudo desde el cliente, lo procesa con el pipeline funcional
    puro, predice el sentimiento con ML y guarda el resultado en la base de datos.
    """
    # 1. Pipeline Funcional Puro (Sin efectos secundarios ni variables mutables)
    texto_procesado = procesar_texto_funcional(mensaje_in.texto_original)
    
    # 2. Predicción con Machine Learning
    sentimiento_predicho = clasificar_sentimiento(texto_procesado)
    
    # 3. Creación del objeto de SQLAlchemy
    nuevo_mensaje = models.Mensaje(
        texto_original=mensaje_in.texto_original,
        texto_limpio=texto_procesado,
        sentimiento=sentimiento_predicho
    )
    
    # 3. Guardado en Base de Datos (Efecto Secundario controlado)
    db.add(nuevo_mensaje)
    db.commit()
    db.refresh(nuevo_mensaje)
    
    return nuevo_mensaje

@app.get("/api/mensajes", response_model=List[schemas.MensajeOut])
def obtener_mensajes(db: Session = Depends(database.get_db)):
    """
    Endpoint para recuperar todas las opiniones registradas.
    Aplica los principios funcionales de proyección mapeando la tabla 
    directamente al esquema de salida.
    """
    mensajes = db.query(models.Mensaje).order_by(models.Mensaje.fecha_creacion.desc()).all()
    return mensajes
