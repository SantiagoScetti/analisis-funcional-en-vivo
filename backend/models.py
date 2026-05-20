from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from database import Base

class Mensaje(Base):
    __tablename__ = "mensajes"

    id = Column(Integer, primary_key=True, index=True)
    texto_original = Column(String, nullable=False)
    texto_limpio = Column(String, nullable=True)
    sentimiento = Column(String, nullable=True)
    # Se usa timezone.utc para buenas prácticas en fechas
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc))
