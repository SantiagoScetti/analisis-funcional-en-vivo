from transformers import pipeline

# Inicializamos el pipeline de clasificación de texto.
# Este modelo de HuggingFace se descargará la primera vez que se ejecute el servidor.
print("Cargando modelo de ML (pysentimiento/robertuito-sentiment-analysis)...")
sentiment_pipeline = pipeline(
    "text-classification",
    model="pysentimiento/robertuito-sentiment-analysis"
)
print("Modelo cargado exitosamente.")

def clasificar_sentimiento(texto: str) -> str:
    """
    Recibe un texto limpio y devuelve la etiqueta de sentimiento predicha.
    Retorna 'POS' (Positivo), 'NEG' (Negativo) o 'NEU' (Neutro).
    """
    # Si el texto está vacío tras la limpieza (ej: el usuario solo mandó emojis),
    # retornamos NEU por defecto para no romper el modelo.
    if not texto.strip():
        return "NEU"
        
    # El pipeline retorna una lista con un diccionario
    # Ejemplo: [{'label': 'POS', 'score': 0.99}]
    resultado = sentiment_pipeline(texto)
    etiqueta = resultado[0]['label']
    
    return etiqueta
