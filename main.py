# main.py
from dotenv import load_dotenv
load_dotenv()                      # <<< MUST be first

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from providers.gemini import query_brand

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
async def search(brand: str):
    return await query_brand(brand)
