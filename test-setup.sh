#!/bin/bash

echo "═════════════════════════════════════════════════════════════"
echo "  TruDeed Setup Verification"
echo "═════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0

# Check function
check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((passed++))
  else
    echo -e "${RED}✗${NC} $1"
    ((failed++))
  fi
}

# Check Node.js
echo "Checking dependencies..."
node --version > /dev/null 2>&1
check "Node.js installed"

# Check pnpm
pnpm --version > /dev/null 2>&1
check "pnpm installed"

# Check Python
python3 --version > /dev/null 2>&1
check "Python 3 installed"

# Check Docker
docker --version > /dev/null 2>&1
check "Docker installed"

# Check Docker Compose
docker-compose --version > /dev/null 2>&1
check "Docker Compose installed"

echo ""
echo "Checking project files..."

# Check key files exist
[ -f "package.json" ]
check "package.json exists"

[ -f "docker-compose.yml" ]
check "docker-compose.yml exists"

[ -d "app" ]
check "Frontend directory exists"

[ -d "backend" ]
check "Backend directory exists"

[ -f "backend/main.py" ]
check "Backend main.py exists"

echo ""
echo "Checking file structure..."

# Check key directories
[ -f "app/page.tsx" ]
check "Landing page exists"

[ -f "app/dashboard/page.tsx" ]
check "Dashboard page exists"

[ -f "app/verify/\[id\]/page.tsx" ]
check "Verification page exists"

[ -f "components/verdict-card.tsx" ]
check "Verdict card component exists"

echo ""
echo "Summary"
echo "───────────────────────────────────────────────────────────"
echo -e "Passed: ${GREEN}${passed}${NC}"
echo -e "Failed: ${RED}${failed}${NC}"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Run: docker-compose up"
  echo "2. Wait 60 seconds for services to start"
  echo "3. Open: http://localhost:3000"
  echo ""
  exit 0
else
  echo -e "${RED}✗ Some checks failed.${NC}"
  echo ""
  echo "Missing items:"
  [ ! -f "package.json" ] && echo "  - Install Node.js (from nodejs.org)"
  [ ! -f "docker-compose.yml" ] && echo "  - Clone repository properly"
  [ ! -d "backend" ] && echo "  - Backend directory missing"
  echo ""
  echo "See README.md for setup instructions"
  exit 1
fi
