import re
from functools import reduce
from typing import Callable

# -- Funciones Puras --

def to_lowercase(text: str) -> str:
    """Convierte el texto a minúsculas."""
    return text.lower()

def remove_special_chars(text: str) -> str:
    """Mantiene solo letras, números y espacios."""
    return re.sub(r'[^\w\s]', '', text)

def strip_whitespaces(text: str) -> str:
    """Elimina espacios extra."""
    return " ".join(text.split())

# -- Composición Funcional --

def compose(*functions: Callable[[str], str]) -> Callable[[str], str]:
    """
    Toma múltiples funciones puras y retorna una nueva función que es la
    composición de todas ellas (de izquierda a derecha / pipe).
    No usa bucles for ni variables mutables.
    """
    return reduce(lambda f, g: lambda x: g(f(x)), functions)

# Definimos el pipeline inmutable
pipeline_limpieza = compose(
    to_lowercase,
    remove_special_chars,
    strip_whitespaces
)

def procesar_texto_funcional(texto: str) -> str:
    """
    Punto de entrada para el procesamiento.
    Aplica el pipeline funcional al texto entrante.
    """
    return pipeline_limpieza(texto)
