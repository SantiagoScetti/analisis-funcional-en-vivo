from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class MensajeCreate(BaseModel):
    texto_original: str

class MensajeOut(BaseModel):
    id: int
    texto_original: str
    texto_limpio: Optional[str]
    sentimiento: Optional[str]
    fecha_creacion: datetime

    # Configuración para Pydantic v2 equivalente a orm_mode = True
    model_config = ConfigDict(from_attributes=True)
