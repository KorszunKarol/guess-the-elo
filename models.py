from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    fen = Column(String)
    actual_elo = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="games")

User.games = relationship("Game", order_by=Game.id, back_populates="user")