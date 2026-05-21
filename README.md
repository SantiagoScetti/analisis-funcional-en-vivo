# ML Funcional — Análisis de Sentimiento e Ingeniería Funcional

Plataforma interactiva en tiempo real diseñada para el ámbito académico, cuyo propósito es demostrar la aplicación práctica de los fundamentos del **Paradigma Funcional** en arquitecturas de software e ingeniería de datos modernas.

El sistema permite a los usuarios enviar opiniones breves desde dispositivos móviles, las cuales son procesadas de forma inmutable, clasificadas mediante un modelo de Machine Learning y proyectadas en tiempo real en un panel analítico.

---

## Características Principales

* **Procesamiento Inmutable:** Tubería de limpieza de texto estructurada mediante transformaciones puras.
* **Clasificación en Tiempo Real:** Integración directa con un modelo Transformer optimizado para español (`pysentimiento/robertuito-sentiment-analysis`).
* **Arquitectura Desacoplada:** Separación estricta entre cliente (React) y servidor (FastAPI) bajo un modelo relacional serverless (PostgreSQL en Neon.tech).
* **Diseño Orientado a Datos:** Dashboard interactivo con métricas dinámicas de distribución de polaridades (Positivo, Negativo, Neutro).

---

## Stack Tecnológico

### Backend
* **Python 3.10+** & **FastAPI** (Estructura de API de alta velocidad)
* **SQLAlchemy** (Mapeo objeto-relacional)
* **HuggingFace Transformers** & **PyTorch** (Inferencia del modelo de lenguaje)
* **Python-dotenv** (Gestión segura de variables de entorno)

### Frontend
* **React** & **Vite** (Entorno de desarrollo y empaquetado ágil)
* **Tailwind CSS** (Estilizado responsivo y utilitario)
* **Lucide React** (Iconografía minimalista de alto contraste)
* **Sonner** (Manejo de microinteracciones y notificaciones tipo Toast)

### Infraestructura y Persistencia
* **PostgreSQL** (Alojado en la nube de Neon.tech)

---

## Principios Funcionales Implementados

La arquitectura del sistema se rige por los conceptos formales evaluados en la cátedra:

1. **Inmutabilidad Absoluta:** Los datos de entrada jamás se modifican en memoria. Cada transformación del pipeline genera nuevas cadenas de texto, garantizando la trazabilidad del dato original.
2. **Composición de Funciones Puras:** El procesamiento de normalización del texto ejecuta secuencialmente funciones atómicas y deterministas mediante la función de orden superior `reduce`, eliminando por completo los bucles imperativos tradicionales.
3. **Functional Core, Imperative Shell:** El núcleo lógico del negocio (limpieza y clasificación) se mantiene estrictamente puro. Los efectos secundarios (operaciones de entrada/salida a la base de datos y peticiones HTTP) se desplazan hacia la periferia del sistema, facilitando la testabilidad de la aplicación.
4. **Proyecciones Declarativas:** El frontend evita la mutación de arreglos globales mediante el uso de operadores inmutables como `.map()` y `.filter()` para renderizar las interfaces y calcular estadísticas dinámicas.

---

## 📂 Estructura del Repositorio

El proyecto adopta una estructura de monorepo organizada de la siguiente manera:

```text
analisis-funcional-en-vivo/
├── backend/                # Servidor FastAPI, pipeline de limpieza y modelos ML
│   ├── database.py         # Configuración del motor SQLAlchemy
│   ├── main.py             # Endpoints, enrutamiento y middleware de CORS
│   ├── ml_model.py         # Carga e inferencia del modelo RoBERTa
│   ├── models.py           # Definición de tablas relacionales (SQLAlchemy)
│   ├── pipeline.py         # Composición funcional de limpieza (reduce)
│   ├── schemas.py          # Esquemas de validación de datos (Pydantic)
│   └── requirements.txt    # Dependencias del servidor de Python
│
├── frontend/               # Aplicación React (Vite + Tailwind)
│   ├── src/
│   │   ├── components/     # Navbar, Dashboard, Formulario y Arquitectura
│   │   ├── App.jsx         # Enrutamiento de la SPA
│   │   └── main.jsx        # Punto de entrada de React
│   └── package.json        # Dependencias y scripts de JavaScript
│
└── .gitignore              # Archivos excluidos del control de versiones (venv, .env)
```

---

## 🔧 Instalación y Configuración Local

### Requisitos Previos
* **Python 3.10** o superior instalado.
* **Node.js** (versión LTS recomendada) e **npm** instalados.
* Una cuenta o instancia activa de **PostgreSQL** (ej. Neon.tech).

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/analisis-funcional-en-vivo.git
cd analisis-funcional-en-vivo
```

### 2. Configuración del Backend

Navega a la carpeta del servidor y crea un entorno virtual:

```bash
cd backend
python -m venv venv
```

Activa el entorno virtual:
* En Windows (PowerShell): `.\venv\Scripts\activate`
* En Linux/Mac: `source venv/bin/activate`

Instala las dependencias:

```bash
pip install -r requirements.txt
```

Crea un archivo `.env` dentro de la carpeta `backend/` y añade tu cadena de conexión a la base de datos:

```plaintext
SQLALCHEMY_DATABASE_URL=postgresql://usuario:password@host/dbname?sslmode=require
```

Inicia el servidor de desarrollo:

```bash
uvicorn main:app --reload
```
*El backend estará disponible en `http://127.0.0.1:8000` y la documentación interactiva en `http://127.0.0.1:8000/docs`.*

### 3. Configuración del Frontend

Abre una nueva terminal, navega a la carpeta del cliente e instala los módulos de Node:

```bash
cd frontend
npm install
```

Inicia el servidor local de Vite:

```bash
npm run dev
```
*La aplicación web estará disponible en `http://localhost:5173`.*

---

## Declaración Académica

Este desarrollo ha sido estructurado respetando las directrices de integridad, inmutabilidad y control de efectos secundarios promovidas por la cátedra de Paradigmas y Lenguajes de Programación.
