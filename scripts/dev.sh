#!/bin/bash

# MindVault Development Helper Script

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

function print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

function print_error() {
    echo -e "${RED}❌ $1${NC}"
}

case "$1" in
    setup)
        print_header "Setting up MindVault"
        npm run install:all
        print_success "Dependencies installed"
        ;;
    
    db:init)
        print_header "Initializing Database"
        npm run init:db
        print_success "Database initialized"
        ;;
    
    dev)
        print_header "Starting Development Server"
        npm run dev
        ;;
    
    clean)
        print_header "Cleaning node_modules"
        npm run clean
        print_success "Cleaned"
        ;;
    
    reset)
        print_header "Full Reset: Clean + Install + DB Init"
        npm run clean
        npm run install:all
        npm run init:db
        print_success "Reset complete"
        ;;
    
    health)
        print_header "Health Check"
        curl -s http://localhost:5001/api/health | json_pp || print_error "Server not running"
        ;;
    
    *)
        echo "MindVault Development Helper"
        echo ""
        echo "Usage: ./scripts/dev.sh [command]"
        echo ""
        echo "Commands:"
        echo "  setup      - Install all dependencies"
        echo "  db:init    - Initialize database"
        echo "  dev        - Start development server"
        echo "  clean      - Remove node_modules"
        echo "  reset      - Full reset (clean + install + db init)"
        echo "  health     - Check server health"
        echo ""
        ;;
esac
