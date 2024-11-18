from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth
from typing import List
import random
from datetime import timedelta
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Pydantic models
class Game(BaseModel):
    id: int
    fen: str
    actual_elo: int

class Guess(BaseModel):
    game_id: int
    guessed_elo: int

# In-memory database (replace with a real database in production)
games: List[Game] = []

@app.get("/")
async def root():
    return {"message": "Welcome to Guess the Elo API"}

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/games/", response_model=schemas.Game)
async def create_game(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_game = models.Game(fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", actual_elo=random.randint(1000, 2500), user_id=current_user.id)
    db.add(new_game)
    db.commit()
    db.refresh(new_game)
    return new_game

@app.get("/games/{game_id}", response_model=schemas.Game)
async def get_game(game_id: int, db: Session = Depends(get_db)):
    game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    return game

@app.post("/guess/")
async def make_guess(guess: Guess):
    for game in games:
        if game.id == guess.game_id:
            difference = abs(game.actual_elo - guess.guessed_elo)
            score = max(0, 100 - difference // 10)
            return {"score": score, "actual_elo": game.actual_elo}
    return {"error": "Game not found"}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Outgoing response: {response.status_code}")
    return response

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"HTTP error: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": "Validation error", "details": exc.errors()},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)