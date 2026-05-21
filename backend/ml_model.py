import os
from pathlib import Path
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from tenacity import retry, stop_after_attempt, wait_fixed

# Cargar variables de entorno desde backend/.env
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

HF_TOKEN = os.getenv("HF_TOKEN")

# Inicializamos el cliente globalmente con el token
client = InferenceClient(token=HF_TOKEN)

PALABRAS_POSITIVAS = ["bueno", "excelente", "genial", "me gusta", "perfecto", "increíble", "maravilloso", "hermoso", "lindo", "fantástico"]
PALABRAS_NEGATIVAS = ["malo", "pésimo", "horrible", "odio", "terrible", "malísimo", "aburrido", "feo", "desastre", "basura"]

@retry(stop=stop_after_attempt(2), wait=wait_fixed(3))
def _call_hf_api(texto: str):
    return client.text_classification(
        texto, 
        model="pysentimiento/robertuito-sentiment-analysis"
    )

def clasificar_sentimiento_fallback(texto: str) -> str:
    """Clasificador de respaldo basado en keywords."""
    texto_lower = texto.lower()
    for palabra in PALABRAS_NEGATIVAS:
        if palabra in texto_lower:
            return "NEG"
    for palabra in PALABRAS_POSITIVAS:
        if palabra in texto_lower:
            return "POS"
    return "NEU"

def clasificar_sentimiento(texto: str) -> str:
    """
    Recibe un texto limpio y devuelve la etiqueta de sentimiento predicha.
    """
    # 1. Diagnóstico Obligatorio
    token_status = "PRESENTE" if HF_TOKEN else "AUSENTE"
    print(f"[Diagnóstico] HF_TOKEN está: {token_status}")
    
    if not texto.strip():
        return "NEU"

    try:
        # 2. Llamada a la API con reintentos automáticos (tenacity)
        resultado = _call_hf_api(texto)
        
        if resultado and len(resultado) > 0:
            if hasattr(resultado[0], 'label'):
                return resultado[0].label
            elif isinstance(resultado[0], dict) and 'label' in resultado[0]:
                return resultado[0]['label']
                
        return clasificar_sentimiento_fallback(texto)
        
    except Exception as e:
        # 1. Diagnóstico de la excepción
        print(f"[Diagnóstico] Fallo en la inferencia de Hugging Face.")
        print(f"[Diagnóstico] Tipo de Excepción: {type(e).__name__}")
        print(f"[Diagnóstico] Mensaje: {str(e)}")
        print("[Diagnóstico] Activando clasificador de respaldo (fallback por degradación elegante)...")
        
        # 3. Fallback Real
        return clasificar_sentimiento_fallback(texto)