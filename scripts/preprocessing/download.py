import chess.pgn
import chess.engine
import random
from supabase import create_client

class ChessGameProcessor:
    def __init__(self, pgn_path, supabase_url, supabase_key):
        self.pgn_path = pgn_path
        self.supabase = create_client(supabase_url, supabase_key)
        self.engine = chess.engine.SimpleEngine.popen_uci("path/to/stockfish")

    def determine_game_phase(self, board):
        """Determine if position is opening, middlegame, or endgame"""
        piece_count = len(board.piece_map())
        if len(board.move_stack) < 10:
            return "opening"
        elif piece_count <= 12:
            return "endgame"
        else:
            return "middlegame"

    def is_interesting_position(self, board, previous_eval, current_eval):
        """Determine if position is worth saving for evaluation guessing"""
        eval_change = abs(current_eval - previous_eval)
        return eval_change > 0.5  # Significant evaluation change

    def process_game(self, game):
        """Process a single game from PGN"""
        # Extract Elo ratings
        white_elo = int(game.headers.get("WhiteElo", 0))
        black_elo = int(game.headers.get("BlackElo", 0))

        # Skip if Elo difference > 100 or invalid ratings
        if abs(white_elo - black_elo) > 100 or white_elo < 700 or black_elo < 700:
            return None

        average_elo = (white_elo + black_elo) // 2

        # Process game for positions
        board = game.board()
        positions = []
        previous_eval = 0

        for move in game.mainline_moves():
            board.push(move)
            game_phase = self.determine_game_phase(board)

            # Get engine evaluation
            result = self.engine.analyse(board, chess.engine.Limit(time=0.1))
            current_eval = result["score"].white().score() / 100  # Convert to pawns

            if self.is_interesting_position(board, previous_eval, current_eval):
                positions.append({
                    "fen": board.fen(),
                    "eval": current_eval,
                    "phase": game_phase
                })

            previous_eval = current_eval

        return {
            "game": game,
            "average_elo": average_elo,
            "white_elo": white_elo,
            "black_elo": black_elo,
            "positions": positions
        }

    def process_pgn_file(self):
        """Process entire PGN file and store in Supabase"""
        with open(self.pgn_path) as pgn:
            while True:
                game = chess.pgn.read_game(pgn)
                if game is None:
                    break

                processed = self.process_game(game)
                if processed:
                    # Store game in Supabase
                    game_id = self.store_game(processed)
                    # Store interesting positions
                    self.store_positions(processed["positions"], game_id)

    def store_game(self, processed_game):
        """Store game in Supabase"""
        data = {
            "pgn": str(processed_game["game"]),
            "average_elo": processed_game["average_elo"],
            "white_elo": processed_game["white_elo"],
            "black_elo": processed_game["black_elo"],
            "game_phase": processed_game["positions"][0]["phase"]  # Initial phase
        }
        result = self.supabase.table("guess_elo_games").insert(data).execute()
        return result.data[0]["id"]

    def store_positions(self, positions, game_id):
        """Store positions in Supabase"""
        for pos in positions:
            data = {
                "fen": pos["fen"],
                "stockfish_eval": pos["eval"],
                "game_phase": pos["phase"],
                "position_type": "tactical" if abs(pos["eval"]) > 1.5 else "strategic",
                "source_game_id": game_id
            }
            self.supabase.table("guess_eval_positions").insert(data).execute()
