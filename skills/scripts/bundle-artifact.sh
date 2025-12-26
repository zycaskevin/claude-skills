#!/bin/bash

# =============================================================================
# Web Artifacts Builder - Bundle Script
# Based on: https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder
# License: Apache 2.0
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Web Artifacts Builder - Bundler${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if we're in a valid project directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found${NC}"
    echo "Please run this script from your project root directory"
    exit 1
fi

if [ ! -f "index.html" ]; then
    echo -e "${RED}Error: index.html not found${NC}"
    echo "Please ensure you have a valid Vite project"
    exit 1
fi

# Check/Install pnpm
echo -e "${YELLOW}Checking pnpm...${NC}"
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}Installing pnpm...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}pnpm is available${NC}"

# Install bundling dependencies
echo ""
echo -e "${YELLOW}Installing bundling tools...${NC}"
pnpm add -D parcel @parcel/config-default @parcel/resolver-default html-inline

# Create Parcel configuration for path aliases
echo -e "${YELLOW}Configuring Parcel...${NC}"
cat > .parcelrc << 'EOF'
{
  "extends": "@parcel/config-default",
  "resolvers": ["@parcel/resolver-default"]
}
EOF

# Clean previous builds
echo -e "${YELLOW}Cleaning previous builds...${NC}"
rm -rf dist .parcel-cache bundle.html

# Build with Vite first (for proper TypeScript/React compilation)
echo ""
echo -e "${YELLOW}Building with Vite...${NC}"
pnpm exec vite build

# Create a temporary HTML for Parcel bundling
echo -e "${YELLOW}Preparing for bundling...${NC}"
cp dist/index.html dist/bundle-source.html

# Bundle with Parcel
echo ""
echo -e "${YELLOW}Bundling with Parcel...${NC}"
cd dist
pnpm exec parcel build bundle-source.html --no-source-maps --dist-dir ../bundle-output --no-cache

cd ..

# Inline all assets into single HTML
echo -e "${YELLOW}Inlining assets...${NC}"
pnpm exec html-inline -i bundle-output/bundle-source.html -o bundle.html

# Cleanup
echo -e "${YELLOW}Cleaning up...${NC}"
rm -rf bundle-output .parcel-cache

# Get file size
BUNDLE_SIZE=$(ls -lh bundle.html | awk '{print $5}')

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Bundle created successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Output: ${BLUE}bundle.html${NC}"
echo -e "Size:   ${BLUE}${BUNDLE_SIZE}${NC}"
echo ""
echo -e "To test:"
echo -e "  open bundle.html  ${YELLOW}# macOS${NC}"
echo -e "  start bundle.html ${YELLOW}# Windows${NC}"
echo ""
echo -e "${GREEN}Ready to share!${NC}"
