from fastapi import FastAPI

app = FastAPI()

@app.post("/process-resumes/{resume_id}")
async def process_resume(resume_id: str):
    return {"message": f"Processing resume {resume_id}"}
