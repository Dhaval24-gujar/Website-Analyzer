from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from analyzer import analyze_site
from database import init_db, save_result, get_all_results, clear_history
import uuid

app = FastAPI(title="Website Performance Analyzer API")

# CORS configuration for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()


# Request/Response Models
class AnalysisRequest(BaseModel):
    urls: List[str]
    fetch_resources: bool = True
    resource_limit: int = 10
    check_advanced: bool = True


class AnalysisResponse(BaseModel):
    task_id: str
    message: str


# In-memory storage for analysis tasks
analysis_tasks = {}


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_websites(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """Start website analysis"""
    task_id = str(uuid.uuid4())
    analysis_tasks[task_id] = {
        "status": "running",
        "progress": 0,
        "total": len(request.urls),
        "results": []
    }

    background_tasks.add_task(
        run_analysis,
        task_id,
        request.urls,
        request.fetch_resources,
        request.resource_limit,
        request.check_advanced
    )

    return AnalysisResponse(
        task_id=task_id,
        message=f"Analysis started for {len(request.urls)} URLs"
    )


def run_analysis(task_id: str, urls: List[str], fetch_resources: bool, resource_limit: int, check_advanced: bool):
    """Background task to run analysis"""
    results = []
    for idx, url in enumerate(urls):
        try:
            result = analyze_site(url, fetch_resources, resource_limit, check_advanced)
            results.append(result)
            save_result(result)

            # Update progress
            analysis_tasks[task_id]["progress"] = idx + 1
            analysis_tasks[task_id]["results"] = results
        except Exception as e:
            results.append({"url": url, "error": str(e)})

    analysis_tasks[task_id]["status"] = "completed"
    analysis_tasks[task_id]["results"] = results


@app.get("/api/analysis/{task_id}")
async def get_analysis_status(task_id: str):
    """Get analysis status and results"""
    if task_id not in analysis_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return analysis_tasks[task_id]


@app.get("/api/history")
async def get_history(limit: int = 100):
    """Get historical analysis data"""
    return get_all_results(limit)


@app.delete("/api/history")
async def delete_history():
    """Clear all historical data"""
    clear_history()
    return {"message": "History cleared successfully"}


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)