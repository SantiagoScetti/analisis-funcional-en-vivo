import os
import time
import requests

def clasificar_sentimiento(texto: str) -> str:
    """
    Recibe un texto limpio y devuelve la etiqueta de sentimiento predicha
    utilizando la API de inferencia de Hugging Face.
    Retorna 'POS', 'NEG' o 'NEU'.
    """
    if not texto.strip():
        return "NEU"

    api_url = "https://api-inference.huggingface.co/models/pysentimiento/robertuito-sentiment-analysis"
    hf_token = os.getenv("HF_TOKEN")
    
    headers = {}
    if hf_token:
        headers["Authorization"] = f"Bearer {hf_token}"
        
    payload = {"inputs": texto}

    max_reintentos = 3
    for intento in range(max_reintentos):
        try:
            response = requests.post(api_url, headers=headers, json=payload, timeout=10)
            response.raise_for_status()
            
            resultado = response.json()
            
            # El formato de respuesta puede variar según el modelo (lista de listas o lista simple)
            if isinstance(resultado, list) and len(resultado) > 0:
                # Formato [[{'label': 'POS', 'score': 0.99}, ...]]
                if isinstance(resultado[0], list) and len(resultado[0]) > 0:
                    return resultado[0][0]['label']
                # Formato [{'label': 'POS', 'score': 0.99}, ...]
                elif isinstance(resultado[0], dict) and 'label' in resultado[0]:
                    return resultado[0]['label']
            
            return "NEU"
            
        except requests.exceptions.RequestException as e:
            print(f"Advertencia: Fallo de red/DNS llamando a Hugging Face (Intento {intento + 1}/{max_reintentos}). Error: {e}")
            if intento < max_reintentos - 1:
                time.sleep(2)
                continue
            return "NEU"
        except Exception as e:
            print(f"Error inesperado llamando a la API de Hugging Face: {e}")
            return "NEU"
            
    return "NEU"
