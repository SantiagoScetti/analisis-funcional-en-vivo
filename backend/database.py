import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")

# Validamos que la variable exista para evitar errores silenciosos
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("Falta la variable de entorno SQLALCHEMY_DATABASE_URL")

# Creamos el motor de conexión a PostgreSQL con rastreo SQL activado
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Configuramos la sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base para definir nuestros modelos de SQLAlchemy
Base = declarative_base()

# Dependencia para inyectar la sesión de DB en nuestros endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
