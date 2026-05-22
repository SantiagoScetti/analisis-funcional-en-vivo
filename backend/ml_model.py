import os
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

HF_TOKEN = os.getenv("HF_TOKEN")
API_URL = "https://router.huggingface.co/hf-inference/models/lxyuan/distilbert-base-multilingual-cased-sentiments-student"

MAPA_ETIQUETAS = {
    "positive": "POS",
    "negative": "NEG",
    "neutral":  "NEU",
}

def clasificar_sentimiento(texto: str) -> str:
    if not HF_TOKEN:
        print("❌ HF_TOKEN ausente")
        return "NEU"

    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {"inputs": texto}

    for intento in range(3):
        try:
            print(f"🤖 Intento {intento + 1} — consultando HF para: '{texto}'")
            response = requests.post(API_URL, headers=headers, json=payload, timeout=25)
            print(f"📡 Status: {response.status_code} | Body: {response.text[:200]}")

            if response.status_code == 503:
                print("⏳ Modelo cargando, esperando 15 segundos...")
                time.sleep(15)
                continue

            response.raise_for_status()
            resultado = response.json()

            candidatos = resultado[0] if isinstance(resultado[0], list) else resultado
            top = max(candidatos, key=lambda x: x["score"])
            etiqueta = MAPA_ETIQUETAS.get(top["label"].lower(), "NEU")
            print(f"✅ Resultado: {etiqueta} (label original: {top['label']}, score: {top['score']:.2f})")
            return etiqueta

        except Exception as e:
            print(f"⚠️ Error intento {intento + 1}: {type(e).__name__}: {e}")

    print("❌ Todos los intentos fallaron, retornando NEU")
    return "NEU"