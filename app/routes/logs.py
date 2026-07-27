from fastapi import APIRouter
from app.repository.log_repo import get_logs

router = APIRouter()

@router.get("/logs")
def fetch_logs(limit: int = 20):
    logs = get_logs(limit)

    return {
        "count": len(logs),
        "logs": logs
    }


