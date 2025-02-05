#!/bin/bash

# Remove duplicates
rm src/components/sections/FeatureCard\ copy.tsx
rm src/components/sections/FeaturesSection\ copy.tsx
rm src/components/sections/HeroSection\ copy.tsx
rm src/components/sections/Navigation\ copy.tsx

# Remove empty directories
find . -type d -empty -delete

# Format files
npx prettier --write .