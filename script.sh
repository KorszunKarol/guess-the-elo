#!/bin/bash

# 1. Move public assets to proper location
mv src/public/ public/

# 2. Reorganize app router structure (escaped parentheses)
mkdir -p "src/app/(main)/guess-the-elo" "src/app/(main)/guess-the-eval"
mv src/app/guess-the-elo/* "src/app/(main)/guess-the-elo/"
mv src/app/guess-the-eval/* "src/app/(main)/guess-the-eval/"

# 3. Clean up API routes
mkdir -p src/app/api/chess
mv src/app/api/endpoints/game.py src/app/api/chess/
mv src/app/api/endpoints/stats.py src/app/api/chess/
mv src/app/api/endpoints/users.py src/app/api/chess/

# 4. Move core utilities
mkdir -p src/lib/auth
mv src/app/core/config.py src/lib/
mv src/app/core/security.py src/lib/auth/

# 5. Final component organization
mv src/components/sections/landing/* src/components/sections/
rmdir src/components/sections/landing

# 6. Type definitions cleanup
mv src/types/stockfish.ts src/types/engine.ts
mv src/app/guess-the-eval/types/index.ts src/types/game.ts

echo "Reorganization completed successfully!"