import os
from pathlib import Path
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# Cargar variables de entorno desde backend/.env
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

HF_TOKEN = os.getenv("HF_TOKEN")

# Inicializamos el cliente globalmente con el token
client = InferenceClient(token=HF_TOKEN)

def clasificar_sentimiento(texto: str) -> str:
    """
    Recibe un texto limpio y devuelve la etiqueta de sentimiento predicha
    utilizando la API oficial de Hugging Face mediante InferenceClient.
    Retorna 'POS', 'NEG' o 'NEU'.
    """
    if not texto.strip():
        return "NEU"

    try:
        # Hacemos la llamada limpia usando el cliente oficial
        resultado = client.text_classification(
            texto, 
            model="pysentimiento/robertuito-sentiment-analysis"
        )
        
        # resultado es típicamente una lista de objetos o diccionarios
        if resultado and len(resultado) > 0:
            if hasattr(resultado[0], 'label'):
                return resultado[0].label
            elif isinstance(resultado[0], dict) and 'label' in resultado[0]:
                return resultado[0]['label']
                
        return "NEU"
        
    except Exception as e:
        print(f"Advertencia: Fallo en la inferencia de Hugging Face: {e}")
        return "NEU"