from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime
import uuid

from app.gateway_service import GatewayService
from app.schemas import ChatRequest
from app.repository.log_repo import save_request
from app.routes.logs import router as logs_router
from app.stats import StatsTracker

app = FastAPI()

# include routers
app.include_router(logs_router)

# CORS (frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

stats = StatsTracker()
gateway = GatewayService()


@app.get("/")
def home():
    return {"message": "GenAI Model Gateway Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/chat")
def chat(request: ChatRequest):

    trace_id = str(uuid.uuid4())

    try:
        response = gateway.handle_chat(request)

        response_dict = response.model_dump()

        response_dict["request_id"] = trace_id
        response_dict["trace_id"] = trace_id
        response_dict["timestamp"] = datetime.now()

        print(response_dict)

        try:
            save_request(response_dict)
        except Exception as db_error:
            print("DB ERROR:", db_error)

        return response_dict

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@app.get("/stats")
def get_stats():
    return stats.get_stats()














