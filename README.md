# GenAI Model Gateway

## Overview

 is a lightweight AI request routing system built using FastAPI and React. It analyzes incoming requests, identifies the task using business rules and machine learning, routes the request to the appropriate AI model, and returns an explainable response. The application also provides real-time monitoring, request logging, performance metrics, and gateway configuration through an interactive dashboard.

---

## Features

- Intelligent AI request routing
- Business Rule Engine for task identification
- Machine Learning Task Classifier
- Ollama fallback for low-confidence predictions
- Intent Planning for multi-step execution
- Dynamic model routing
- Explainable routing decisions
- AI provider abstraction
- Request logging and monitoring
- Performance metrics dashboard
- Gateway configuration interface

---

## Architecture

```
                User Request
                      │
                      ▼
             Business Rules Engine
                      │
        ┌─────────────┴─────────────┐
        │                           │
     Task Found?                  No Match
        │                           │
        ▼                           ▼
 Business Rules              ML Task Classifier
                                  │
                       Confidence ≥ Threshold?
                          │              │
                        Yes             No
                          │              │
                          ▼              ▼
                 Task Identified   Ollama Classifier
                          │              │                 
                          ▼              ▼
                       ─────────────────────
                                │   
                                ▼ 
                          Intent Planner
                                │
                                ▼
                           Model Router
                                │
                                ▼
                        AI Provider Layer
                                │
                                ▼
                         Response Builder
                                │
                                ▼
                         Client + Dashboard
```

---

## Tech Stack

### Backend

- Python
- FastAPI
- Uvicorn
- MySQL
- Scikit-learn
- Joblib
- PyYAML
- Ollama

### Frontend

- React
- Vite
- Recharts
- CSS

---

## Project Structure

```
GenAI-Model-Gateway/
│
├── app/
│   ├── providers/
│   ├── repository/
│   ├── routes/
│   ├── business_rules.py
│   ├── classifier.py
│   ├── config.py
│   ├── database.py
│   ├── gateway_service.py
│   ├── intent_planner.py
│   ├── main.py
│   ├── ollama_classifier.py
│   ├── response_builder.py
│   ├── router.py
│   ├── schemas.py
│   └── stats.py
│
├── config/
│   ├── models.yaml
│   └── routing_rules.yaml
│
├── data/
│   ├── generate_training_data.py
│   ├── seed_logs.py
│   └── training_data.csv
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── gateway.css
│   ├── package.json
│   └── vite.config.js
│
├── ml/
│   ├── task_classifier.joblib
│   └── train_classifier.py
│
├── requirements.txt
└── README.md
└── .gitignore
```

---

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd GenAI-Model-Gateway
```

---

### 2. Backend Setup

Create a virtual environment.

```bash
python -m venv venv
```

Activate the environment.

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

---

## Running the Application

### Start Backend

```bash
uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

---

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

## Ollama Setup

Install Ollama.

Pull the required model.

```bash
ollama pull llama3.2
```

Start the Ollama service before running the gateway.

---

## Database

Create a MySQL database.

Update the database configuration in the project with your credentials.

Example:

```
Host: localhost
Port: 3306
Database: ai_gateway
```

---

## API Endpoints

### Chat Request

```
POST /chat
```

Processes a user request through the AI Gateway.

---

### Logs

```
GET /logs
```

Returns request history.

---

### Statistics

```
GET /stats
```

Returns gateway performance statistics.

---

## Supported Task Types

- Short Question Answering
- Summarization
- Classification
- Code Generation
- SQL Generation
- Email Drafting
- Data Extraction
- Reasoning

---

## Routing Strategy

- Business Rules
- ML Task Classification
- Ollama Fallback
- Intent Planning
- Model Routing
- Provider Execution
- Response Builder

---

## Dashboard Modules

- Gateway Overview
- Gateway Console
- Request Logs
- Performance Metrics
- Settings

---

## Dependencies

### Python

- fastapi
- uvicorn
- pydantic
- mysql-connector-python
- scikit-learn
- joblib
- numpy
- pandas
- pyyaml
- requests

### Frontend

- react
- react-dom
- vite
- recharts

---

## Future Improvements

- Support additional LLM providers
- Authentication and authorization
- Streaming responses
- Docker deployment
- Cloud deployment
- Advanced monitoring

---

## Author

**Akshita**

GenAI Model Gateway Internship Project
